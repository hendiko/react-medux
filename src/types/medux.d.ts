/*
 * @Author: Xavier Yin
 * @Date: 2021-12-05 14:23:43
 */
export declare interface TransformToEntries {
  (arg: string | string[] | { [k?: string]: any }): Array<[string, string]>;
  (arg: function): function;
}
