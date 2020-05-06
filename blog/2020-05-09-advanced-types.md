---
id: advanced-types
title: TypeScript 高级类型
---

TypeScript 提供了一些高级类型以推断复杂的类型。

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
let value: Obj['a']
```

#### 泛型约束

通过 extends 关键字来约束泛型的类型或属性。

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

由旧类型创建出新类型。

#### `Readonly<T>`

#### `Partial<T>`

#### `Pick<T, K>`

#### `Record<K, T>`

### 条件类型

T extends U ? X : Y。

#### `Exclude<T, U>`

#### `Extract<T, U>`

#### `NonNullable<T>`

#### `ReturnType<T>`

### infer

https://jkchao.github.io/typescript-book-chinese/tips/infer.html#%E4%BB%8B%E7%BB%8D

### 摩多

https://github.com/piotrwitek/utility-types

```ts
// valueOf
type ValueOf<T> = T[keyof T];
```
