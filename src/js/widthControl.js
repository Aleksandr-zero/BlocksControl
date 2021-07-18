class WidthControl {
    /**
	* @param container -> block "width-control-container" ( type -> HTMLElement )
	* @param options -> custom settings ( type -> Object )
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
		this.calculatesNumber_For_ScrollingWindow_Block_OutOfSight();
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
		/* Навешивает событие скроллы для экрана.  */

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

		if ( positionWindow.top - this.blocks[1].block.clientHeight <= this.blocks[1].position.top &&
			this.blocks[1].position.top < positionWindow.bottom ) {

			this.calculatesWindowScrolling();

			if (this.blocks[1].isVisible) {
				return;
			};

			this.blocks[1].isVisible = true;

		} else if ( this.blocks[1].isVisible ) {
			this.blocks[1].isVisible = false;
		};
	}

	// Вспомогательные
	calculatesWindowScrolling() {
		/* Рассчитывает на сколько процентов проскролено окно при видимости из одного блока.  */

		const percentWindowScrolling = (window.innerHeight - this.blocks[1].block.getBoundingClientRect().top) / this.blocks[1].percentScrollWindow;

		this.changeBlock(percentWindowScrolling);
	}


	// Добавление свойств в обьект <blocks>
	findsBlocks_In_Container() {
		/* Находит нужные блоки в 'container'.  */

		const blocks = this.container.children;

		Array.prototype.forEach.call(blocks, (block) => {
			for (let index = 0; index < block.classList.length; index++) {
				if ( block.classList[index].includes("width-control-block") ) {
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
		/* Выщитывает конечную ширину блока при изменение и начальную.  */

		const sequenceNumbersBlocks = Object.keys(this.blocks);

		sequenceNumbersBlocks.forEach((number) => {
			let finalWidth = 0;

			const percentWidth = this.blocks[number].block.clientWidth / 100;
			const number_To_ChangeWidth = percentWidth * this.blocks[number].percent;

			if ( this.blocks[number].effect === "enlarge" ) {
				finalWidth = this.blocks[number].block.clientWidth + number_To_ChangeWidth;
			} else if ( this.blocks[number].effect === "reduce" ) {
				finalWidth = this.blocks[number].block.clientWidth - number_To_ChangeWidth;
			};

			this.blocks[number].finalWidth = finalWidth;
			this.blocks[number].initialWidth = this.blocks[number].block.clientWidth;
		});
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
	changeBlock(percentWindowScrolling) {
		/* Производит действие над элементом при изменение экрана.  */

		const numberForChangeWidth = percentWindowScrolling * ((this.blocks[1].finalWidth - this.blocks[1].initialWidth) / 100);
		let newWidth = this.blocks[1].initialWidth;

		if ( this.blocks[1].effect === "enlarge" ) {
			newWidth += numberForChangeWidth;
		} else if ( this.blocks[1].effect === "reduce" ) {
			newWidth -= numberForChangeWidth;
		};

		this.setsNewWidthForBlock(newWidth);
	}

	setsNewWidthForBlock(newWidth) {
		this.blocks[1].block.style.width = `${newWidth}px`;
	}


	run() {
		this.addEventScrollForWindow();
	}
};


const blockContainer = document.querySelector(".width-control-container");

