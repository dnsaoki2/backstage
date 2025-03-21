## API Report File for "@backstage/catalog-model"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { JsonObject } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';
import { JsonValue } from '@backstage/types';
import { SerializedError } from '@backstage/errors';
import * as yup from 'yup';

// @public @deprecated
export const analyzeLocationSchema: yup.SchemaOf<{
  location: LocationSpec;
}>;

// @public
interface ApiEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'API';
  // (undocumented)
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    definition: string;
    system?: string;
  };
}
export { ApiEntityV1alpha1 as ApiEntity };
export { ApiEntityV1alpha1 };

// @public
export const apiEntityV1alpha1Validator: KindValidator;

// @public
export class CommonValidatorFunctions {
  static isJsonSafe(value: unknown): boolean;
  static isValidDnsLabel(value: unknown): boolean;
  static isValidDnsSubdomain(value: unknown): boolean;
  static isValidPrefixAndOrSuffix(
    value: unknown,
    separator: string,
    isValidPrefix: (value: string) => boolean,
    isValidSuffix: (value: string) => boolean,
  ): boolean;
  static isValidString(value: unknown): boolean;
  static isValidTag(value: unknown): boolean;
  static isValidUrl(value: unknown): boolean;
}

// @public
export function compareEntityToRef(
  entity: Entity,
  ref: EntityRef | EntityName,
  context?: EntityRefContext,
): boolean;

// @public
interface ComponentEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'Component';
  // (undocumented)
  spec: {
    type: string;
    lifecycle: string;
    owner: string;
    subcomponentOf?: string;
    providesApis?: string[];
    consumesApis?: string[];
    dependsOn?: string[];
    system?: string;
  };
}
export { ComponentEntityV1alpha1 as ComponentEntity };
export { ComponentEntityV1alpha1 };

// @public
export const componentEntityV1alpha1Validator: KindValidator;

// @public
export class DefaultNamespaceEntityPolicy implements EntityPolicy {
  constructor(namespace?: string);
  // (undocumented)
  enforce(entity: Entity): Promise<Entity>;
}

// @public
interface DomainEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'Domain';
  // (undocumented)
  spec: {
    owner: string;
  };
}
export { DomainEntityV1alpha1 as DomainEntity };
export { DomainEntityV1alpha1 };

// @public
export const domainEntityV1alpha1Validator: KindValidator;

// @public
export const EDIT_URL_ANNOTATION = 'backstage.io/edit-url';

// @public
export type Entity = {
  apiVersion: string;
  kind: string;
  metadata: EntityMeta;
  spec?: JsonObject;
  relations?: EntityRelation[];
  status?: UNSTABLE_EntityStatus;
};

// @public
export const ENTITY_DEFAULT_NAMESPACE = 'default';

// @public
export const ENTITY_META_GENERATED_FIELDS: readonly [
  'uid',
  'etag',
  'generation',
];

// @public
export type EntityEnvelope = {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
  };
};

// @public
export function entityEnvelopeSchemaValidator<
  T extends EntityEnvelope = EntityEnvelope,
>(schema?: unknown): (data: unknown) => T;

// @public
export function entityHasChanges(previous: Entity, next: Entity): boolean;

// @public
export function entityKindSchemaValidator<T extends Entity>(
  schema: unknown,
): (data: unknown) => T | false;

// @public
export type EntityLink = {
  url: string;
  title?: string;
  icon?: string;
};

// @public
export type EntityMeta = JsonObject & {
  uid?: string;
  etag?: string;
  generation?: number;
  name: string;
  namespace?: string;
  title?: string;
  description?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  tags?: string[];
  links?: EntityLink[];
};

// @public
export type EntityName = {
  kind: string;
  namespace: string;
  name: string;
};

// @public
export const EntityPolicies: {
  allOf(policies: EntityPolicy[]): EntityPolicy;
  oneOf(policies: EntityPolicy[]): EntityPolicy;
};

// @public
export type EntityPolicy = {
  enforce(entity: Entity): Promise<Entity | undefined>;
};

// @public
export type EntityRef =
  | string
  | {
      kind?: string;
      namespace?: string;
      name: string;
    };

// @public
export type EntityRefContext = {
  defaultKind?: string;
  defaultNamespace?: string;
};

// @public
export type EntityRelation = {
  type: string;
  target: EntityName;
};

// @public
export type EntityRelationSpec = {
  source: EntityName;
  type: string;
  target: EntityName;
};

// @public
export function entitySchemaValidator<T extends Entity = Entity>(
  schema?: unknown,
): (data: unknown) => T;

// @public
export class FieldFormatEntityPolicy implements EntityPolicy {
  constructor(validators?: Validators);
  // (undocumented)
  enforce(entity: Entity): Promise<Entity>;
}

// @public
export function generateEntityEtag(): string;

// @public
export function generateEntityUid(): string;

// @public
export function generateUpdatedEntity(previous: Entity, next: Entity): Entity;

// @public
export function getEntityName(entity: Entity): EntityName;

// @public
export function getEntitySourceLocation(entity: Entity): {
  type: string;
  target: string;
};

// @public
interface GroupEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'Group';
  // (undocumented)
  spec: {
    type: string;
    profile?: {
      displayName?: string;
      email?: string;
      picture?: string;
    };
    parent?: string;
    children: string[];
    members?: string[];
  };
}
export { GroupEntityV1alpha1 as GroupEntity };
export { GroupEntityV1alpha1 };

// @public
export const groupEntityV1alpha1Validator: KindValidator;

// @public
export type JSONSchema = JSONSchema7 & {
  [key in string]?: JsonValue;
};

// @public
export type KindValidator = {
  check(entity: Entity): Promise<boolean>;
};

// @public
export class KubernetesValidatorFunctions {
  // (undocumented)
  static isValidAnnotationKey(value: unknown): boolean;
  // (undocumented)
  static isValidAnnotationValue(value: unknown): boolean;
  // (undocumented)
  static isValidApiVersion(value: unknown): boolean;
  // (undocumented)
  static isValidKind(value: unknown): boolean;
  // (undocumented)
  static isValidLabelKey(value: unknown): boolean;
  // (undocumented)
  static isValidLabelValue(value: unknown): boolean;
  // (undocumented)
  static isValidNamespace(value: unknown): boolean;
  // (undocumented)
  static isValidObjectName(value: unknown): boolean;
}

// @public
type Location_2 = {
  id: string;
} & LocationSpec;
export { Location_2 as Location };

// @public
export const LOCATION_ANNOTATION = 'backstage.io/managed-by-location';

// @public
interface LocationEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'Location';
  // (undocumented)
  spec: {
    type?: string;
    target?: string;
    targets?: string[];
    presence?: 'required' | 'optional';
  };
}
export { LocationEntityV1alpha1 as LocationEntity };
export { LocationEntityV1alpha1 };

// @public
export const locationEntityV1alpha1Validator: KindValidator;

// @public @deprecated
export const locationSchema: yup.SchemaOf<Location_2>;

// @public
export type LocationSpec = {
  type: string;
  target: string;
  presence?: 'optional' | 'required';
};

// @public @deprecated
export const locationSpecSchema: yup.SchemaOf<LocationSpec>;

// @public
export function makeValidator(overrides?: Partial<Validators>): Validators;

// @public
export class NoForeignRootFieldsEntityPolicy implements EntityPolicy {
  constructor(knownFields?: string[]);
  // (undocumented)
  enforce(entity: Entity): Promise<Entity>;
}

// @public
export const ORIGIN_LOCATION_ANNOTATION =
  'backstage.io/managed-by-origin-location';

// @public
export function parseEntityName(
  ref: EntityRef,
  context?: EntityRefContext,
): EntityName;

// @public
export function parseEntityRef(
  ref: EntityRef,
  context?: {
    defaultKind: string;
    defaultNamespace: string;
  },
): EntityName;

// @public
export function parseEntityRef(
  ref: EntityRef,
  context?: {
    defaultKind: string;
  },
): {
  kind: string;
  namespace?: string;
  name: string;
};

// @public
export function parseEntityRef(
  ref: EntityRef,
  context?: {
    defaultNamespace: string;
  },
): {
  kind?: string;
  namespace: string;
  name: string;
};

// @public
export function parseLocationReference(ref: string): {
  type: string;
  target: string;
};

// @public
export const RELATION_API_CONSUMED_BY = 'apiConsumedBy';

// @public
export const RELATION_API_PROVIDED_BY = 'apiProvidedBy';

// @public
export const RELATION_CHILD_OF = 'childOf';

// @public
export const RELATION_CONSUMES_API = 'consumesApi';

// @public
export const RELATION_DEPENDENCY_OF = 'dependencyOf';

// @public
export const RELATION_DEPENDS_ON = 'dependsOn';

// @public
export const RELATION_HAS_MEMBER = 'hasMember';

// @public
export const RELATION_HAS_PART = 'hasPart';

// @public
export const RELATION_MEMBER_OF = 'memberOf';

// @public
export const RELATION_OWNED_BY = 'ownedBy';

// @public
export const RELATION_OWNER_OF = 'ownerOf';

// @public
export const RELATION_PARENT_OF = 'parentOf';

// @public
export const RELATION_PART_OF = 'partOf';

// @public
export const RELATION_PROVIDES_API = 'providesApi';

// @public
interface ResourceEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'Resource';
  // (undocumented)
  spec: {
    type: string;
    owner: string;
    dependsOn?: string[];
    system?: string;
  };
}
export { ResourceEntityV1alpha1 as ResourceEntity };
export { ResourceEntityV1alpha1 };

// @public
export const resourceEntityV1alpha1Validator: KindValidator;

// @public
export class SchemaValidEntityPolicy implements EntityPolicy {
  // (undocumented)
  enforce(entity: Entity): Promise<Entity>;
}

// @public @deprecated
export function serializeEntityRef(
  ref:
    | Entity
    | {
        kind?: string;
        namespace?: string;
        name: string;
      },
): EntityRef;

// @public
export const SOURCE_LOCATION_ANNOTATION = 'backstage.io/source-location';

// @public
export function stringifyEntityRef(
  ref:
    | Entity
    | {
        kind: string;
        namespace?: string;
        name: string;
      },
): string;

// @public
export function stringifyLocationReference(ref: {
  type: string;
  target: string;
}): string;

// @public
interface SystemEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'System';
  // (undocumented)
  spec: {
    owner: string;
    domain?: string;
  };
}
export { SystemEntityV1alpha1 as SystemEntity };
export { SystemEntityV1alpha1 };

// @public
export const systemEntityV1alpha1Validator: KindValidator;

// @public
export interface TemplateEntityV1beta2 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1beta2';
  // (undocumented)
  kind: 'Template';
  // (undocumented)
  spec: {
    type: string;
    parameters?: JsonObject | JsonObject[];
    steps: Array<{
      id?: string;
      name?: string;
      action: string;
      input?: JsonObject;
      if?: string | boolean;
    }>;
    output?: {
      [name: string]: string;
    };
    owner?: string;
  };
}

// @public
export const templateEntityV1beta2Validator: KindValidator;

// @alpha
export type UNSTABLE_EntityStatus = {
  items?: UNSTABLE_EntityStatusItem[];
};

// @alpha
export type UNSTABLE_EntityStatusItem = {
  type: string;
  level: UNSTABLE_EntityStatusLevel;
  message: string;
  error?: SerializedError;
};

// @alpha
export type UNSTABLE_EntityStatusLevel = 'info' | 'warning' | 'error';

// @public
interface UserEntityV1alpha1 extends Entity {
  // (undocumented)
  apiVersion: 'backstage.io/v1alpha1' | 'backstage.io/v1beta1';
  // (undocumented)
  kind: 'User';
  // (undocumented)
  spec: {
    profile?: {
      displayName?: string;
      email?: string;
      picture?: string;
    };
    memberOf: string[];
  };
}
export { UserEntityV1alpha1 as UserEntity };
export { UserEntityV1alpha1 };

// @public
export const userEntityV1alpha1Validator: KindValidator;

// @public
export type Validators = {
  isValidApiVersion(value: unknown): boolean;
  isValidKind(value: unknown): boolean;
  isValidEntityName(value: unknown): boolean;
  isValidNamespace(value: unknown): boolean;
  isValidLabelKey(value: unknown): boolean;
  isValidLabelValue(value: unknown): boolean;
  isValidAnnotationKey(value: unknown): boolean;
  isValidAnnotationValue(value: unknown): boolean;
  isValidTag(value: unknown): boolean;
};

// @public
export const VIEW_URL_ANNOTATION = 'backstage.io/view-url';

// Warnings were encountered during analysis:
//
// src/entity/Entity.d.ts:41:5 - (ae-incompatible-release-tags) The symbol "status" is marked as @public, but its signature references "UNSTABLE_EntityStatus" which is marked as @alpha
```
