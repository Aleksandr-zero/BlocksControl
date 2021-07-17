class WidthControl {
    /**
	* @param container -> block "width-control-container" ( type -> HTMLElement )
	* @param options -> custom settings ( type -> Object )
    */

	constructor(container, options) {
		this.container = container;
		this.options = options;

		this.blocks = {};

		this.findsBlocks_In_Container();
		this.countsPositionBlocks_Window();

		this.complementsOptions_Blocks();
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
			// console.log(positionWindow);
		});
	}

	checks_If_BlcokVisible(positionWindow) {
		/* Проверяет находится ли слайдер в зоне видимости.  */

		if ( positionWindow.top - this.blocks[1].block.clientHeight <= this.blocks[1].position.top &&
			this.blocks[1].position.top < positionWindow.bottom ) {

			if (this.blocks[1].isVisible) {
				return;
			};

			this.blocks[1].isVisible = true;

		} else if ( this.blocks[1].isVisible ) {
			this.blocks[1].isVisible = false;
		};
	}


	// Вспомогательные методы
	findsBlocks_In_Container() {
		/* Находит нужные блоки в 'container'.  */

		const blocks = this.container.children;

		Array.prototype.forEach.call(blocks, (block) => {
			for (let index = 0; index < block.classList.length; index++) {
				if ( block.classList[index].includes("width-control-block") ) {
					const splitText = block.classList[index].split("-");
					const serialNumber = splitText[splitText.length - 1];

					this.blocks[serialNumber] = { block: block };

					// Добавление свойства <isVisible> ( для проверки видимости блока на экране ).
					this.blocks[serialNumber].isVisible = false;

					continue;
				};
			};
		});
	}

	countsPositionBlocks_Window() {
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


	// Функционал
	changeBlock() {
		/* Производит действие над элементом при изменение экрана.  */
	}


	run() {
		this.addEventScrollForWindow();
	}
};


const blockContainer = document.querySelector(".width-control-container");

const newWidthControl = new WidthControl(blockContainer, {
	1: {
		effect: "enlarge",
		percent: 30
	},
	2: {
		effect: "reduce",
		percent: 25
	}
});
newWidthControl.run();