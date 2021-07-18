class WidthControl {
    /**
	* @param container -> block "width-control-container" ( type -> HTMLElement )
	* @param options -> settings for blocks ( type -> Object )
	*/

	constructor(container, options) {
		this.container = container;
		this.options = options;

		this.blocks = {};
		this.percentHeightWindow = window.innerHeight / 100;

		this.findsBlocks_In_Container();
		this.calculatesPositionBlocks_Window();

		this.complementsOptions_Blocks();
		this.calculatesFinalBlockWidth();
		this.calculatesFinalBlockHeight();
		this.calculatesNumber_For_ScrollingWindow_Block_OutOfSight();

		this.sequenceNumbersBlocks = Object.keys(this.blocks);
	}

	complementsOptions_Blocks() {
		/* Дополняет настройки для свойства <blocks>.  */

		const sequenceNumbersBlocks = Object.keys(this.options);

		sequenceNumbersBlocks.forEach((number) => {
			for (const key in this.options[number]) {
				this.blocks[number][key] = this.options[number][key]
			};
		});
	}

	// Навешивание событий
	addEventScrollForWindow() {
		/* Навешивает событие скролла для экрана.  */

		window.addEventListener("scroll", () => {
			const positionWindow = {
				top: window.pageYOffset,
				bottom: window.pageYOffset + document.documentElement.clientHeight
			};

			this.checks_If_BlcokVisible(positionWindow);
		});
	}

	checks_If_BlcokVisible(positionWindow) {
		/* Проверяет находится ли блок в зоне видимости.  */

		this.sequenceNumbersBlocks.forEach((serialNumber) => {
			if ( positionWindow.top - this.blocks[serialNumber].block.clientHeight <= this.blocks[serialNumber].position.top &&
				this.blocks[serialNumber].position.top < positionWindow.bottom ) {

				this.calculatesWindowScrolling(serialNumber);

				if (this.blocks[serialNumber].isVisible) {
					return;
				};

				this.blocks[serialNumber].isVisible = true;

			} else if ( this.blocks[serialNumber].isVisible ) {
				this.blocks[serialNumber].isVisible = false;
			};
		});
	}

	// Вспомогательные
	calculatesWindowScrolling(serialNumber) {
		/* Рассчитывает на сколько процентов проскролено окно при видимости из одного блока.  */

		const percentWindowScrolling = (window.innerHeight - this.blocks[serialNumber].block.getBoundingClientRect().top) / this.blocks[1].percentScrollWindow;

		this.changeBlock(serialNumber, percentWindowScrolling);
	}


	// Добавление свойств в обьект <blocks>
	findsBlocks_In_Container() {
		/* Находит нужные блоки в <container>.  */

		const blocks = this.container.children;

		Array.prototype.forEach.call(blocks, (block) => {
			for (let index = 0; index < block.classList.length; index++) {
				if ( block.classList[index].includes("blocks-control-block") ) {
					const splitText = block.classList[index].split("-");
					const serialNumber = splitText[splitText.length - 1];

					this.blocks[serialNumber] = { block: block };

					this.addProperty_IsVisible_Block(serialNumber);

					continue;
				};
			};
		});
	}

	addProperty_IsVisible_Block(serialNumber) {
		/* Добавление свойства <isVisible> ( для проверки видимости блока на экране ).  */
		this.blocks[serialNumber].isVisible = false;
	}

	calculatesPositionBlocks_Window() {
		/* Выщитывает кординты блоков.  */

		const sequenceNumbersBlocks = Object.keys(this.blocks);

		sequenceNumbersBlocks.forEach((number) => {
			const positionBlock = {
				top: Math.round(window.pageYOffset + this.blocks[number].block.getBoundingClientRect().top),
				bottom: Math.round(window.pageXOffset + this.blocks[number].block.getBoundingClientRect().bottom)
			};

			this.blocks[number].position = positionBlock;
		});
	}

	calculatesFinalBlockWidth() {
		/* Выщитывает начальную ширину и конечную ширину блока при изменение.  */

		const sequenceNumbersBlocks = Object.keys(this.blocks);

		for (let number = 0; number < sequenceNumbersBlocks.length; number++) {
			const sequenceNumber = sequenceNumbersBlocks[number];

			if ( this.blocks[sequenceNumber].actionProperty !== "width" ) {
				continue;
			};

			let finalWidth = 0;

			const percentWidth = this.blocks[sequenceNumber].block.clientWidth / 100;
			const number_To_ChangeWidth = percentWidth * this.blocks[sequenceNumber].percent;

			if ( this.blocks[sequenceNumber].action === "enlarge" ) {
				finalWidth = this.blocks[sequenceNumber].block.clientWidth + number_To_ChangeWidth;
			} else if ( this.blocks[sequenceNumber].action === "reduce" ) {
				finalWidth = this.blocks[sequenceNumber].block.clientWidth - number_To_ChangeWidth;
			};

			this.blocks[sequenceNumber].finalWidth = finalWidth;
			this.blocks[sequenceNumber].initialWidth = this.blocks[sequenceNumber].block.clientWidth;
		};
	}

	calculatesFinalBlockHeight() {
		/* Выщитывает начальную высоту и конечную высоту блока при изменение.  */

		const sequenceNumbersBlocks = Object.keys(this.blocks);

		for (let number = 0; number < sequenceNumbersBlocks.length; number++) {
			const sequenceNumber = sequenceNumbersBlocks[number];

			if ( this.blocks[sequenceNumber].actionProperty !== "height" ) {
				continue;
			};

			let finalHeight = 0;

			const percentHeight = this.blocks[sequenceNumber].block.clientHeight / 100;
			const number_To_ChangeHeight = percentHeight * this.blocks[sequenceNumber].percent;

			if ( this.blocks[sequenceNumber].action === "enlarge" ) {
				finalHeight = this.blocks[sequenceNumber].block.clientHeight + number_To_ChangeHeight;
			} else if ( this.blocks[sequenceNumber].action === "reduce" ) {
				finalHeight = this.blocks[sequenceNumber].block.clientHeight - number_To_ChangeHeight;
			};

			this.blocks[sequenceNumber].finalHeight = finalHeight;
			this.blocks[sequenceNumber].initialHeight = this.blocks[sequenceNumber].block.clientHeight;
		};
	}

	calculatesNumber_For_ScrollingWindow_Block_OutOfSight() {
		/*
		Рассчитывает число для прокрутки окна чтобы блок при первом появление, после
		прокрутки этого числа вышел из зоны видимости.
		*/

		const sequenceNumbersBlocks = Object.keys(this.blocks);

		sequenceNumbersBlocks.forEach((number) => {
			const numberToScrollWindow = window.innerHeight + this.blocks[number].block.getBoundingClientRect().height;
			const percentScrollWindow = numberToScrollWindow / 100;

			this.blocks[number].numberToScrollWindow = numberToScrollWindow;
			this.blocks[number].percentScrollWindow = percentScrollWindow;
		});
	}


	// Функционал
	changeBlock(serialNumber, percentWindowScrolling) {
		/* Производит действие над элементом при изменение экрана.  */

		if ( this.blocks[serialNumber].actionProperty === "width" ) {
			const numberForChangeWidth = Math.abs(percentWindowScrolling * ((this.blocks[serialNumber].finalWidth - this.blocks[serialNumber].initialWidth) / 100));
			let newWidth = this.blocks[serialNumber].initialWidth;

			if ( this.blocks[serialNumber].action === "enlarge" ) {
				newWidth += numberForChangeWidth;
			} else if ( this.blocks[serialNumber].action === "reduce" ) {
				newWidth -= numberForChangeWidth;
			};

			this.setsNewWidthForBlock(serialNumber, newWidth);

		} else if ( this.blocks[serialNumber].actionProperty === "height" ) {
			const numberForChangeWidth = Math.abs(percentWindowScrolling * ((this.blocks[serialNumber].finalHeight - this.blocks[serialNumber].initialHeight) / 100));
			let newHeight = this.blocks[serialNumber].initialHeight;

			if ( this.blocks[serialNumber].action === "enlarge" ) {
				newHeight += numberForChangeWidth;
			} else if ( this.blocks[serialNumber].action === "reduce" ) {
				newHeight -= numberForChangeWidth;
			};

			this.setsNewHeightForBlock(serialNumber, newHeight);
		};
	}

	setsNewWidthForBlock(serialNumber, newWidth) {
		this.blocks[serialNumber].block.style.width = `${newWidth}px`;
	}

	setsNewHeightForBlock(serialNumber, newHeight) {
		this.blocks[serialNumber].block.style.height = `${newHeight}px`;
	}


	run() {
		this.addEventScrollForWindow();
	}
};


// RUN
const blockContainer_1 = document.querySelector(".blocks-control-container-1");
const newWidthControl_1 = new WidthControl(blockContainer_1, {
	1: {
		action: "enlarge",
		actionProperty: "width",
		percent: 45
	},
	2: {
		action: "reduce",
		actionProperty: "width",
		percent: 25
	}
});
newWidthControl_1.run();


const blockContainer_2 = document.querySelector(".blocks-control-container-2");
const newWidthControl_2 = new WidthControl(blockContainer_2, {
	1: {
		action: "enlarge",
		actionProperty: "width",
		percent: 45
	},
	2: {
		action: "reduce",
		actionProperty: "width",
		percent: 70
	},
	3: {
		action: "enlarge",
		actionProperty: "width",
		percent: 40
	}
});
newWidthControl_2.run();


const blockContainer_3 = document.querySelector(".blocks-control-container-3");
const newWidthControl_3 = new WidthControl(blockContainer_3, {
	1: {
		action: "enlarge",
		actionProperty: "height",
		percent: 75,
	},
	2: {
		action: "reduce",
		actionProperty: "width",
		percent: 50
	},
	3: {
		action: "enlarge",
		actionProperty: "height",
		percent: 50
	}
});
newWidthControl_3.run();