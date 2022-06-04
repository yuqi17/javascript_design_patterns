
dependency  依赖：依赖对象，要么是本类方法局部变量，要么是外部创建传入形参，要么之间依赖类调用静态方法。

association 关联： 关联对象的引用```作为被关联类的成员```，而成员的初始化是靠外部创建，```以形参传入```，再以this 关联。可以双向关联，不需要先等对方创建。

aggregation 聚合： 被聚合的对象的引用也是成员，只是用```构造方法从外部传入```，这意味着跟关联不同，它必须要等被聚合对象先创建。

composition 组合：被组合的对象直接在组合的类```构造方法里面创建```，这样关系就更紧密，一起销毁，一起创建。

realization 实现: 即子类对父类的继承，子类还可以重写父类的方法，也可以扩展其它成员

generalization 泛化: 即类对接口的实现

6 者的依赖关系：dependency < association < aggregation < composition < generalization = realization

另 [UML 图的看法](https://blog.csdn.net/zhaxun/article/details/124048871)

### 总结： 三角实现是泛化，三角虚线是实现；依赖虚线箭头；单向关联实线箭头数字，双向关联数字实线两头；聚合空心菱形；组合实心菱形，


