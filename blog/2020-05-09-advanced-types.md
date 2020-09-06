---
id: advanced-types
title: TypeScript 高级类型
---

在此介绍几种 TypeScript 提供的高级类型。

<!--truncate-->

### 索引类型

从一个对象中选取某些属性的值。

#### keyof T

索引类型查询操作符，表示类型 T 的所有公共属性的字面量联合类型。

```ts
interface Obj {
    a: number
    b: string
}
let key: keyof Obj // let key: "a" | "b"
```

#### T[K]

索引访问操作符，表示对象 T 的属性 K 所代表的类型。

```ts
let value: Obj['a'] // let value: string
```

#### 泛型约束

通过 extends 关键字来约束泛型的类型或属性。

```ts
type Test<T extends Obj> = {
    test: keyof T // test: 'a' | 'b'
};
```

#### 试试吧

```ts
// 选取对象 o 的属性子集
function pluck(o, names) {
    return names.map(n => o[n]);
}
```

```ts
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    eturn names.map(n => o[n]);
}
```

### 映射类型

由旧类型创建出新类型，基于 `[key in keys expression]`。

这是类似于索引类型（index type）的语法，in 在内部使用了 for ... in，类型变量 key 会依次绑定到 keys 中的每个属性。

```ts
type Mapped = {
    [key in 'a' | 'b']: number;
}

type Mapped = {
    a: number;
    b: number;
}
```

#### `Readonly<T>`

将 T 的所有属性变为只读。

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

#### `Partial<T>`

将 T 的所有属性变为可选。

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

#### `Pick<T, K>`

选取以 K 为属性的对象 T 的子集。

```ts
type Pick<T, K extends keyof T> = { // 约束 K
    [P in K]: T[P];
};

type Picked = Pick<Obj, 'a' | 'b'> // 例子
```

#### `Record<K, T>`

创建属性为 K 的新对象，属性值的类型为 T。

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

这里解释一下 `keyof any`，实际上等同于 `string | number | symbol`。

### 条件类型

基于 `T extends U ? X : Y`。

如果 T 是联合类型的话，结果也会是多个条件类型的联合类型。

#### `Exclude<T, U>`

从 T 中过滤掉可以赋值给 U 的类型。

```ts
type Exclude<T, U> = T extends U ? never : T;

// Exclude<'a', 'a' | 'e'> | Exclude<'b', 'a' | 'e'> | Exclude<'c', 'a' | 'e'>
type exclude = Exclude<'a' | 'b' | 'c', 'a' | 'e'>; // 'b' | 'c'
```

#### `Extract<T, U>`

从 T 中抽出可以赋值给 U 的类型。

```ts
type Extract<T, U> = T extends U ? T : never;
```

#### `Omit<T, K>`

以 T 的所有 excluse K 的属性创建一个新类型。

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

#### `NonNullable<T>`

从 T 中除去 undefined 和 null。

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### `ReturnType<T>`

获取函数 T 的返回值类型。

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

#### infer

在条件类型的 extends 子语句中，允许使用 infer 声明，代表一个待推断的类型变量。该变量可以在条件类型的 true 分支中被引用。

##### 匹配模式

```ts
type Unpacked<T> =
    T extends (infer U)[] ? U :
    T extends (...args: any[]) => infer U ? U :
    T extends Promise<infer U> ? U :
    T;

type T0 = Unpacked<string>;  // string
type T1 = Unpacked<string[]>;  // string
type T2 = Unpacked<() => string>;  // string
type T3 = Unpacked<Promise<string>>;  // string
type T4 = Unpacked<Promise<string>[]>;  // Promise<string>
type T5 = Unpacked<Unpacked<Promise<string>[]>>;  // string
```

在协变位置上，同一个类型变量的多个候选类型会被推断为联合类型：

```ts
type Foo<T> = T extends { a: infer U, b: infer U } ? U : never;
type T10 = Foo<{ a: string, b: string }>;  // string
type T11 = Foo<{ a: string, b: number }>;  // string | number
```

在逆变位置（函数参数）上，同一个类型变量的多个候选类型会被推断为交叉类型：

```ts
type Bar<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;
type T20 = Bar<{ a: (x: string) => void, b: (x: string) => void }>;  // string
type T21 = Bar<{ a: (x: string) => void, b: (x: number) => void }>;  // string & number
```

##### 协变与逆变

在一个函数类型中，返回值类型是协变的，而参数类型是逆变的。

返回值类型是协变的，意思是 `A ≼ B` 就意味着 `(T → A) ≼ (T → B)` 。参数类型是逆变的，意思是 `A ≼ B` 就意味着 `(B → T) ≼ (A → T)`。

```
if Greyhound ≼ Dog ≼ Animal
    (Animal → Greyhound) ≼ (Dog → Dog)
```

在 TypeScript 中，参数类型是双向协变的：https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant ，可以通过 `--strictFunctionTypes` 或 `--strict` 标记来修复这个问题。

##### more

https://jkchao.github.io/typescript-book-chinese/tips/infer.html#leetcode-%E7%9A%84%E4%B8%80%E9%81%93-typescript-%E9%9D%A2%E8%AF%95%E9%A2%98

<!-- #### `Parameters<T>`

#### `ConstructorParameters<T>`

#### `InstanceType<T>` -->

#### `ThisType<T>`

https://jkchao.github.io/typescript-book-chinese/typings/thisType.html

### 摩多

https://github.com/piotrwitek/utility-types

```ts
// valueOf
type ValueOf<T> = T[keyof T];
```

### 参考

* https://stackoverflow.com/questions/55535598/why-does-keyof-any-have-type-of-string-number-symbol-in-typescript
* https://www.tslang.cn/docs/release-notes/typescript-2.8.html
* https://jkchao.github.io/typescript-book-chinese/tips/infer.html#%E4%BB%8B%E7%BB%8D
* https://github.com/Microsoft/TypeScript/pull/21496
* https://jkchao.github.io/typescript-book-chinese/tips/covarianceAndContravariance.html
* https://jkchao.github.io/typescript-book-chinese/typings/thisType.html
* https://github.com/piotrwitek/utility-types