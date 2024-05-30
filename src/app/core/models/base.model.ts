import { ClassConstructor, ClassTransformOptions, instanceToInstance, instanceToPlain, plainToClass } from 'class-transformer';
import { get } from 'lodash-es';
export abstract class BaseModel {
  static fromJson<T extends BaseModel, V>(this: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T {
    const configs = options ?? {};
    return plainToClass(this, plain, { ...configs, excludeExtraneousValues: true });
  }
  static toJson<T extends BaseModel, V>(object: T, options?: ClassTransformOptions): Record<string, any> {
    const configs = options ?? {};
    return instanceToPlain<T>(object, { ...configs, excludeExtraneousValues: true });
  }

  static fromClass<T extends BaseModel, V extends BaseModel>(this: ClassConstructor<T>, classObj: V, options?: ClassTransformOptions): T {
    const plain = instanceToPlain(classObj);
    const configs = options ?? {};
    return plainToClass(this, plain, { ...configs, excludeExtraneousValues: true });
  }

  static createEmpty<T extends BaseModel>(this: ClassConstructor<T>, options?: ClassTransformOptions): T {
    const configs = options ?? {};
    return plainToClass(this, {}, { ...configs, excludeExtraneousValues: true });
  }

  static clone<T extends BaseModel, V extends T>(this: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T {
    return instanceToInstance(plain, options);
  }

  static merge<T extends BaseModel, V>(this: ClassConstructor<T>, classObj: T, plain: V, options?: ClassTransformOptions): T {
    const plainObj = instanceToPlain(classObj);
    const objMerged = Object.assign(plainObj, plain);
    return plainToClass(this, objMerged, options);
  }

  /**
   * get value from string path
   *
   * @param classObj data
   * @param path string path
   * get value in object: BaseModel.get('obj.key1')
   * get value in array: BaseModel.get('arr[index]')
   * get value in array object: BaseModel.get('arr[index].key1')
   */
  static get<T extends BaseModel>(this: ClassConstructor<T>, data: T, path: string, defaultValue?: unknown): unknown {
    return get(data, path, defaultValue);
  }
}
