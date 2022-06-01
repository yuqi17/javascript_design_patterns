// 引用: https://www.likecs.com/show-305682920.html

interface Expression {
	interpret(context: Context);
}

class Context {
	constructor(public pattern: string, public text: string) {

	}

	currentTextIndex: number = 0;
	get currentText(): string {
		return this.text[this.currentTextIndex];
	}

	currentPatternIndex: number = 0;
	lastExpression: string;
	get currentPatternExpression(): string {
		return this.pattern[this.currentPatternIndex];
	}

	isMatch: boolean;
}

// 开始符号：^
class BeginExpression implements Expression {
	interpret(context: Context) {
		context.isMatch = context.currentPatternIndex === 0;
		context.currentPatternIndex++;
	}
}

// 结束符号：$
class EndExpression implements Expression {
	interpret(context: Context) {
		context.isMatch = context.currentTextIndex === context.text.length;
		context.currentPatternIndex++;
	}
}

// 反斜杠：\d，只支持\d
class BslashExpression implements Expression {
	interpret(context: Context) {
		if (context.pattern[context.currentPatternIndex + 1] !== 'd') {
			throw new Error('only support \\d');
		}

		let target = context.currentText;
		context.lastExpression = '\\d';
		context.isMatch = Number.isInteger(Number.parseInt(target));
		context.currentPatternIndex += 2;
		context.currentTextIndex++;
	}
}

// 中括号：[]
class BracketExpression implements Expression {
	interpret(context: Context) {
		let prevIndex = context.currentPatternIndex;
		while (context.pattern[++context.currentPatternIndex] !== ']') {
			if (context.currentPatternIndex + 1 === context.pattern.length) {
				throw new Error(`miss symbol ]`);
			}
		}
		let expression = context.pattern.substr(prevIndex + 1, context.currentPatternIndex - prevIndex - 1);
		let target = context.currentText;

		context.lastExpression = `[${expression}]`;
		context.isMatch = [...expression].indexOf(target) > -1;
		context.currentPatternIndex++;
		context.currentTextIndex++;
	}
}

// 大括号：{}
class BraceExpression implements Expression {
	interpret(context: Context) {
		let endIndex = context.currentPatternIndex;
		while (context.pattern[++endIndex] !== '}') {
			if (i + 1 === context.pattern.length) {
				throw new Error(`miss symbol }`);
			}
		}
		let expression = context.pattern.substr(context.currentPatternIndex + 1, endIndex - context
			.currentPatternIndex - 1);
		let num = Number.parseInt(expression);
		if (!Number.isInteger(num)) {
			throw new Error('{} only support number');
		}
		let newExpression = '';
		for (let i = 1; i < num; i++) {
			newExpression += context.lastExpression;
		}
		context.pattern = context.pattern.substr(0, context.currentPatternIndex) +
			newExpression +
			context.pattern.substr(endIndex + 1);

	}
}

// 普通字符
class StringExpression implements Expression {
	interpret(context: Context) {
		context.lastExpression = context.currentPatternExpression;
		context.isMatch = context.currentPatternExpression === context.currentText;
		context.currentPatternIndex++;
		context.currentTextIndex++;
	}
}

class Regex {
	mapping: {
		[key: string]: Expression
	} = {
		'^': new BeginExpression(),
		'$': new EndExpression(),
		'{': new BraceExpression(),
		'[': new BracketExpression(),
		'\\': new BslashExpression(),
	}; // 这是一个表达式-解释器的映射表
	stringExp: Expression = new StringExpression();

	constructor(private pattern: string) {

	}

	IsMatch(text: string): boolean {
		let context = new Context(this.pattern, text);

		for (context.currentPatternIndex = 0; context.currentPatternIndex < context.pattern.length;) {
			let symbol = this.mapping[context.currentPatternExpression];
			symbol ? symbol.interpret(context) : this.stringExp.interpret(context); //通过找到对应的解释器来解释匹配文本
			if (!context.isMatch) {
				break;
			}
		}
		return context.isMatch;
	}
}

let pattern = '/^1[34578]\d{9}$/';
let regex = new Regex(pattern);

let text = '13712345678';
console.log(`match ${text}: ${regex.IsMatch(text)}`); // 正常手机号：成功

text = '1371234567p';
console.log(`match ${text}: ${regex.IsMatch(text)}`); // 手机号里有字母：失败

text = '137123456789';
console.log(`match ${text}: ${regex.IsMatch(text)}`); // 多了一位：失败

text = '1371234567';
console.log(`match ${text}: ${regex.IsMatch(text)}`); // 少了一位：失败
