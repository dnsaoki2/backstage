/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from 'express';
import { THOUSAND_DAYS_MS, TEN_MINUTES_MS, OAuthAdapter } from './OAuthAdapter';
import { encodeState } from './helpers';
import { OAuthHandlers, OAuthResponse } from './types';

const mockResponseData = {
  providerInfo: {
    accessToken: 'ACCESS_TOKEN',
    token: 'ID_TOKEN',
    expiresInSeconds: 10,
    scope: 'email',
  },
  profile: {
    email: 'foo@bar.com',
  },
  backstageIdentity: {
    id: 'foo',
    token:
      'eyblob.eyJzdWIiOiJqaW1teW1hcmt1bSIsImVudCI6WyJ1c2VyOmRlZmF1bHQvamltbXltYXJrdW0iXX0=.eyblob',
  },
};

function mkTokenBody(payload: unknown): string {
  return Buffer.from(JSON.stringify(payload), 'utf8')
    .toString('base64')
    .replace(/=/g, '');
}

describe('OAuthAdapter', () => {
  class MyAuthProvider implements OAuthHandlers {
    async start() {
      return {
        url: '/url',
        status: 301,
      };
    }
    async handler() {
      return {
        response: mockResponseData,
        refreshToken: 'token',
      };
    }
    async refresh() {
      return mockResponseData;
    }
  }
  const providerInstance = new MyAuthProvider();
  const oAuthProviderOptions = {
    providerId: 'test-provider',
    secure: false,
    disableRefresh: true,
    appOrigin: 'http://localhost:3000',
    cookieDomain: 'localhost',
    cookiePath: '/auth/test-provider',
    tokenIssuer: {
      issueToken: async () => 'my-id-token',
      listPublicKeys: async () => ({ keys: [] }),
    },
    isOriginAllowed: () => false,
  };

  it('sets the correct headers in start', async () => {
    const oauthProvider = new OAuthAdapter(
      providerInstance,
      oAuthProviderOptions,
    );
    const mockRequest = {
      query: {
        scope: 'user',
        env: 'development',
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      statusCode: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.start(mockRequest, mockResponse);
    // nonce cookie checks
    expect(mockResponse.cookie).toBeCalledTimes(1);
    expect(mockResponse.cookie).toBeCalledWith(
      `${oAuthProviderOptions.providerId}-nonce`,
      expect.any(String),
      expect.objectContaining({ maxAge: TEN_MINUTES_MS }),
    );
    // redirect checks
    expect(mockResponse.setHeader).toHaveBeenCalledTimes(2);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Location', '/url');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Length', '0');
    expect(mockResponse.statusCode).toEqual(301);
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
  });

  it('sets the refresh cookie if refresh is enabled', async () => {
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: false,
      isOriginAllowed: () => false,
    });

    const state = { nonce: 'nonce', env: 'development' };
    const mockRequest = {
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: encodeState(state),
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      expect.stringContaining('token'),
      expect.objectContaining({
        path: '/auth/test-provider',
        maxAge: THOUSAND_DAYS_MS,
      }),
    );
  });

  it('does not set the refresh cookie if refresh is disabled', async () => {
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: true,
      isOriginAllowed: () => false,
    });

    const mockRequest = {
      cookies: {
        'test-provider-nonce': 'nonce',
      },
      query: {
        state: 'nonce',
      },
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.frameHandler(mockRequest, mockResponse);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(0);
  });

  it('removes refresh cookie when logging out', async () => {
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: false,
      isOriginAllowed: () => false,
    });

    const mockRequest = {
      header: () => 'XMLHttpRequest',
    } as unknown as express.Request;

    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.logout(mockRequest, mockResponse);
    expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      expect.stringContaining('test-provider-refresh-token'),
      '',
      expect.objectContaining({ path: '/auth/test-provider' }),
    );
    expect(mockResponse.end).toHaveBeenCalledTimes(1);
  });

  it('gets new access-token when refreshing', async () => {
    oAuthProviderOptions.disableRefresh = false;
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: false,
      isOriginAllowed: () => false,
    });

    const mockRequest = {
      header: () => 'XMLHttpRequest',
      cookies: {
        'test-provider-refresh-token': 'token',
      },
      query: {},
    } as unknown as express.Request;

    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      ...mockResponseData,
      backstageIdentity: {
        id: mockResponseData.backstageIdentity.id,
        token: mockResponseData.backstageIdentity.token,
        idToken: mockResponseData.backstageIdentity.token,
        identity: {
          ownershipEntityRefs: ['user:default/jimmymarkum'],
          type: 'user',
          userEntityRef: 'jimmymarkum',
        },
      },
    });
  });

  it('handles refresh without capabilities', async () => {
    const oauthProvider = new OAuthAdapter(providerInstance, {
      ...oAuthProviderOptions,
      disableRefresh: true,
      isOriginAllowed: () => false,
    });

    const mockRequest = {
      header: () => 'XMLHttpRequest',
    } as unknown as express.Request;

    const mockResponse = {} as unknown as express.Response;

    await expect(
      oauthProvider.refresh(mockRequest, mockResponse),
    ).rejects.toThrow(
      'Refresh token is not supported for provider test-provider',
    );
  });

  it('correctly populates incomplete identities', async () => {
    const mockRefresh = jest.fn<Promise<OAuthResponse>, [express.Request]>();

    const oauthProvider = new OAuthAdapter(
      {
        refresh: mockRefresh,
        start: jest.fn(),
        handler: jest.fn(),
      } as OAuthHandlers,
      {
        ...oAuthProviderOptions,
        tokenIssuer: {
          issueToken: async ({ claims }) => `a.${mkTokenBody(claims)}.a`,
          listPublicKeys: async () => ({ keys: [] }),
        },
        disableRefresh: false,
        isOriginAllowed: () => false,
      },
    );

    const mockRequest = {
      header: () => 'XMLHttpRequest',
      cookies: {
        'test-provider-refresh-token': 'token',
      },
      query: {},
    } as unknown as express.Request;

    const mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as express.Response;

    // Without a token
    mockRefresh.mockResolvedValueOnce({
      ...mockResponseData,
      backstageIdentity: {
        id: 'foo',
        token: '',
      },
    });
    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenLastCalledWith({
      ...mockResponseData,
      backstageIdentity: {
        id: 'foo',
        token: `a.${mkTokenBody({ sub: 'user:default/foo' })}.a`,
        idToken: `a.${mkTokenBody({ sub: 'user:default/foo' })}.a`,
        identity: {
          type: 'user',
          userEntityRef: 'user:default/foo',
          ownershipEntityRefs: [],
        },
      },
    });

    // With a token
    mockRefresh.mockResolvedValueOnce({
      ...mockResponseData,
      backstageIdentity: {
        id: 'foo',
        token: `z.${mkTokenBody({ sub: 'user:my-ns/foo' })}.z`,
      },
    });
    await oauthProvider.refresh(mockRequest, mockResponse);
    expect(mockResponse.json).toHaveBeenCalledTimes(2);
    expect(mockResponse.json).toHaveBeenLastCalledWith({
      ...mockResponseData,
      backstageIdentity: {
        id: 'foo',
        token: `z.${mkTokenBody({ sub: 'user:my-ns/foo' })}.z`,
        idToken: `z.${mkTokenBody({ sub: 'user:my-ns/foo' })}.z`,
        identity: {
          type: 'user',
          userEntityRef: 'user:my-ns/foo',
          ownershipEntityRefs: [],
        },
      },
    });
  });
});
