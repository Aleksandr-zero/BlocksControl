class WidthControl {
    /**
	* @param container -> block "width-control-container" ( type -> HTMLElement )
	* @param options -> settings for blocks ( type -> Object )
	*/

	constructor(container, options) {
		this.container = container;
		this.options = options;

		this.blocks = {};

		this.findsBlocks_In_Container();
		this.sequenceNumbersBlocks = Object.keys(this.blocks);

		this.calculatesPositionBlocks_Window();

		this.complementsOptions_Blocks();
		this.addPercentScrolledPartOfPage();
		this.calculatesFinalBlockWidth();
		this.calculatesFinalBlockHeight();
		this.calculatesNumber_For_ScrollingWindow_Block_OutOfSight();
	}

	complementsOptions_Blocks() {
		/* Дополняет настройки для обьекта <blocks>.  */

		this.sequenceNumbersBlocks.forEach((number) => {
			for ( const key in this.options[number] ) {
				this.blocks[number][key] = this.options[number][key]
			};
		});
	}

	// Навешивание событий
	addEventScrollForWindow() {
		/* Навешивает событие скролла для экрана.  */

		window.addEventListener("scroll", () => {
			this.checks_If_BlcokVisible({
				top: window.pageYOffset,
				bottom: window.pageYOffset + document.documentElement.clientHeight
			});
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

		// Отложенный запуск
		if ( this.blocks[serialNumber].delayedLaunch && this.blocks[serialNumber].delayedLaunch[0] ) {
			if ( percentWindowScrolling < this.blocks[serialNumber].delayedLaunch[1] ) {
				return
			};
		};

		this.setsPercentScrolledPartOfPage(serialNumber, percentWindowScrolling, [false]);
		this.changeBlock(serialNumber, percentWindowScrolling);
	}

	setsPercentScrolledPartOfPage(serialNumber, percentWindowScrolling, isDelayedLaunch) {
		if ( percentWindowScrolling >= 100 ) {
			return;
		};

		if ( isDelayedLaunch[0] ) {
			this.blocks[serialNumber].scrolledPartOfPage_For_DelayedLaunch = percentWindowScrolling - this.blocks[serialNumber].delayedLaunch[1];
			return;
		};

		if ( !this.blocks[serialNumber].delayedLaunch && !isDelayedLaunch[0] ) {
			this.blocks[serialNumber].scrolledPartOfPage = percentWindowScrolling;
		};
	}

	checks_If_PercentageNeedsChanged(serialNumber, percentWindowScrolling, percentDelayedLaunch) {
		/* Проверяет нужно ли изменить процент (нужно для отложеннного запуска).  */

		if ( this.blocks[serialNumber].delayedLaunchNumber !== percentWindowScrolling / (100 / percentDelayedLaunch) ) {
			this.blocks[serialNumber].delayedLaunchNumber = percentWindowScrolling / (100 / percentDelayedLaunch);
		};
	}


	// Добавление свойств в обьект <blocks>
	findsBlocks_In_Container() {
		/* Находит нужные блоки в <container>.  */

		const blocks = this.container.children;

		Array.prototype.forEach.call(blocks, (block) => {
			for ( let index = 0; index < block.classList.length; index++ ) {
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

	addPercentScrolledPartOfPage() {
		this.sequenceNumbersBlocks.forEach((number) => {
			this.blocks[number].scrolledPartOfPage = 0;
		});
	}

	addProperty_IsVisible_Block(serialNumber) {
		/* Добавление свойства <isVisible> ( для проверки видимости блока на экране ).  */
		this.blocks[serialNumber].isVisible = false;
	}

	calculatesPositionBlocks_Window() {
		/* Выщитывает кординты блоков.  */

		this.sequenceNumbersBlocks.forEach((serialNumber) => {
			const positionBlock = {
				top: Math.round(window.pageYOffset + this.blocks[serialNumber].block.getBoundingClientRect().top),
				bottom: Math.round(window.pageXOffset + this.blocks[serialNumber].block.getBoundingClientRect().bottom)
			};

			this.blocks[serialNumber].position = positionBlock;
		});
	}

	calculatesFinalBlockWidth() {
		/* Выщитывает начальную ширину и конечную ширину блока при изменение.  */

		for (let serialNumber = 0; serialNumber < this.sequenceNumbersBlocks.length; serialNumber++) {
			const sequenceNumber = this.sequenceNumbersBlocks[serialNumber];

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

		for (let serialNumber = 0; serialNumber < this.sequenceNumbersBlocks.length; serialNumber++) {
			const sequenceNumber = this.sequenceNumbersBlocks[serialNumber];

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

		this.sequenceNumbersBlocks.forEach((serialNumber) => {
			const numberToScrollWindow = window.innerHeight + this.blocks[serialNumber].block.getBoundingClientRect().height;
			const percentScrollWindow = numberToScrollWindow / 100;

			this.blocks[serialNumber].percentScrollWindow = percentScrollWindow;
		});
	}


	// Функционал
	changeBlock(serialNumber, percentWindowScrolling) {
		/* Производит действие над элементом при изменение экрана.  */

		let _percentWindowScrolling = this.blocks[serialNumber].scrolledPartOfPage;

		// Отложенный запуск.
		if ( this.blocks[serialNumber].delayedLaunch && this.blocks[serialNumber].delayedLaunch[0] ) {
			_percentWindowScrolling = this.blocks[serialNumber].scrolledPartOfPage_For_DelayedLaunch;

			this.checks_If_PercentageNeedsChanged(
				serialNumber,
				_percentWindowScrolling,
				this.blocks[serialNumber].delayedLaunch[1]
			);

			this.blocks[serialNumber].scrolledPartOfPage = this.blocks[serialNumber].scrolledPartOfPage_For_DelayedLaunch + this.blocks[serialNumber].delayedLaunchNumber;

			_percentWindowScrolling = this.blocks[serialNumber].scrolledPartOfPage;

			this.setsPercentScrolledPartOfPage(serialNumber, percentWindowScrolling, [true, _percentWindowScrolling]);
		};

		if ( this.blocks[serialNumber].actionProperty === "width" ) {
			const numberForChangeWidth = Math.abs(_percentWindowScrolling * ((this.blocks[serialNumber].finalWidth - this.blocks[serialNumber].initialWidth) / 100));
			let newWidth = this.blocks[serialNumber].initialWidth;

			if ( this.blocks[serialNumber].action === "enlarge" ) {
				newWidth += numberForChangeWidth;
			} else if ( this.blocks[serialNumber].action === "reduce" ) {
				newWidth -= numberForChangeWidth;
			};

			this.setsNewWidthForBlock(serialNumber, newWidth);

		} else if ( this.blocks[serialNumber].actionProperty === "height" ) {
			const numberForChangeWidth = Math.abs(_percentWindowScrolling * ((this.blocks[serialNumber].finalHeight - this.blocks[serialNumber].initialHeight) / 100));
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


const blockContainer_4 = document.querySelector(".blocks-control-container-4");
const newWidthControl_4 = new WidthControl(blockContainer_4, {
	1: {
		action: "enlarge",
		actionProperty: "height",
		percent: 45,
	},
	2: {
		action: "reduce",
		actionProperty: "width",
		percent: 25,
		delayedLaunch: [true, 30]
	}
});
newWidthControl_4.run();
