// TODO(jthegedus): unit tests? e2e tests which validate output HTML?
(function () {
	const classNames = {
		selectContainer: "content",
		selectBlock: "docsify-select",
		selectGroup: "docsify-select-group",
		selectMenuContainer: "docsify-select-menu-container",
		selectMenu: "docsify-select-menu",
		selectOption: "docsify-select__option",
		selectContent: "docsify-select__content",
		selectContentActive: "docsify-select__content--active",
	};
	const commentReplaceMark = "select:replace";
	const regex = {
		// Matches markdown code blocks (inline and multi-line)
		// Example: ```text```N
		codeMarkup: /(```[\s\S]*?```)/gm,

		// Matches select replacement comment
		// 0: Match
		// 1: Replacement HTML
		commentReplaceMarkup: new RegExp(`<!-- ${commentReplaceMark} (.*) -->`),

		// Matches select set by start/end comment
		// 0: Match
		// 1: Indent
		// 2: Start comment: <!-- select:start -->
		// 3: Labels and content
		// 4: End comment: <!-- select:end -->
		selectBlockMarkup:
			/[\r\n]*(\s*)(<!-+\s+select:\s*?start\s+-+>)[\r\n]+([\s|\S]*?)[\r\n\s]+(<!-+\s+select:\s*?end\s+-+>)/m,

		// Matches select lables by select-label comment
		// given - <!-- select-menu-labels: some,labels -->
		// 0: Match
		// 1: Indent
		// 2: Comment: <!-- select-menu-labels:
		// 3: Menu Labels: some,labels
		// 4: Comment tail: -->
		selectMenuLabelsMarkup:
			/[\r\n]*(\s*)(<!-+\s+select-menu-labels:\s*)([\s|\S]*?)(\s+-+>)/m,

		// Matches select option and content
		// 0: Match
		// 1: Option: #### --Label-- OR #### ~~Label~~
		// 2: Content
		selectHeadingMarkup:
			/[\r\n]*(\s*)#{1,6}\s*[~-]{2}\s*(.*\S)\s*[~-]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[~-]{2}|<!-+\s+select:\s*?end\s+-+>)/m,

		// Matches select option and content
		// 0: Match
		// 1: Option: #### Label <!-- selection-option -->
		// 2: Content
		selectHeadingComment:
			/[\r\n]*(\s*)#{1,6}\s*(.*?)\s*<!-+\s+select-option\s+-+>[\r\n]+([\s\S]*?)(?=#{1,6}\s*[^\r\n]*<!-+\s+select-option\s+-+>|<!-+\s+select:\s*?end\s+-+>)/m,
	};

	type selected = {
		[key: string]: string;
	};
	const settings = {
		sync: false,
		useSelectHeadingComment: false,
		detectOperatingSystem: { enabled: false, menuId: "operating-system" },
		theme: "classic",
		selected: {} as selected,
	};

	function styleInject(css: string, ref: any) {
		if (ref === void 0) ref = {};
		const insertAt = ref.insertAt;
		if (!css || typeof document === "undefined") {
			return;
		}
		const head = document.head || document.getElementsByTagName("head")[0];
		const style = document.createElement("style");
		style.setAttribute("type", "text/css");
		if (insertAt === "top") {
			if (head.firstChild) {
				head.insertBefore(style, head.firstChild);
			} else {
				head.appendChild(style);
			}
		} else {
			head.appendChild(style);
		}
		// NOTE: proposed "correct method"
		// if (style.style) {
		// 	style.style.cssText = css;

		// @ts-ignore: this type errors in TS but the proposed correct method does not work
		if (style.styleSheet) {
			// @ts-ignore: this type errors in TS but the proposed correct method does not work
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
	}
	const css = `
:root {
	--docsifyselect-font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
	/* Select Groups (wraps entire select section, container and content) */
	/* Select Menu Container (wraps label and menu) */
	--docsifyselect-menu-container-margin: 8px 4px 0 0;
	/* Select Menu Labels */
	--docsifyselect-menu-label-font-size: 14px;
	--docisfyselect-menu-label-text-transform: capitalize;
	/* Select Menu */
	--docsifyselect-menu-arrow: url("data:image/svg+xml; utf8, <svg fill='rgb(77, 77, 77)' height='16' width='16' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' ><path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' ></path></svg>");
	--docsifyselect-menu-background: #f8f8f8;
	--docsifyselect-menu-border-color: #cbd5e0;
	--docsifyselect-menu-border-radius: 4px;
	--docsifyselect-menu-border-width: 1px;
	--docsifyselect-menu-box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
	--docsifyselect-menu-font-size: 16px;
	--docsifyselect-menu-line-height: 20px;
	--docsifyselect-menu-margin: 0px;
	--docsifyselect-menu-padding: 8px 32px 8px 16px;
	--docisfyselect-menu-width: 256px;
	/* Select Menu Options */
	/* Select Content */
	--docsifyselect-content-background: inherit;
	--docsifyselect-content-padding: 0px;
}

.docsify-select-menu {
	width: var(--docisfyselect-menu-width);
}

.docsify-select-group {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.docsify-select__content {
	visibility: hidden;
	position: absolute;
	overflow: hidden;
	height: 0;
	width: 100%;
}

.docsify-select__content--active {
	visibility: visible;
	position: relative;
	overflow: auto;
	height: auto;
}

[class*="docsify-select--"] .docsify-select-menu {
	width: var(--docisfyselect-menu-width);
}

.docsify-select--classic .docsify-select-group {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.docsify-select--classic .docsify-select-menu-container {
	margin: var(--docsifyselect-menu-container-margin);
}

.docsify-select--classic .docsify-select-menu-container label {
	color: inherit;
	font-size: var(--docsifyselect-menu-label-font-size);
	font-weight: 700;
	font-family: var(--docsifyselect-font-family);
	letter-spacing: 0.3px;
	line-height: 19.5px;
	text-transform: var(--docisfyselect-menu-label-text-transform);
}

.docsify-select--classic .docsify-select-menu {
	background: var(--docsifyselect-menu-background) var(--docsifyselect-menu-arrow) calc(100% - 12px) 50% / 12px no-repeat;
	border-color: var(--docsifyselect-menu-border-color);
	border-radius: var(--docsifyselect-menu-border-radius);
	border-style: solid;
	border-width: var(--docsifyselect-menu-border-width);
	box-shadow: var(--docsifyselect-menu-box-shadow);
	box-sizing: border-box;
	color: inherit;
	display: block;
	font-family: var(--docsifyselect-font-family);
	font-size: var(--docsifyselect-menu-font-size);
	line-height: var(--docsifyselect-menu-line-height);
	margin: var(--docsifyselect-menu-margin);
	padding: var(--docsifyselect-menu-padding);
	text-align: start;
	text-transform: none;
	width: var(--docisfyselect-menu-width);
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
}

.docsify-select--classic .docsify-select__content {
	padding: var(--docsifyselect-content-padding);
	background: var(--docsifyselect-content-background);
}

.docsify-select--classic .docsify-select__content--active {
	padding: var(--docsifyselect-content-padding);
	background: var(--docsifyselect-content-background);
}`
	styleInject(css, {
		insertAt: "top",
	});

	// Functions
	// =============================================================================
	/**
	 * Converts select content into "stage 1" markup. Stage 1 markup contains temporary
	 * comments which are replaced with HTML during Stage 2. This approach allows
	 * all markdown to be converted to HTML before select-specific HTML is added.
	 */
	function renderSelectGroupsStage1(content: string): string {
		const codeBlockMatch = content.match(regex.codeMarkup) || [];
		const codeBlockMarkers = codeBlockMatch.map((item, i) => {
			const codeMarker = `<!-- ${commentReplaceMark} CODEBLOCK${i} -->`;

			// Replace code block with marker to ensure select markup within code
			// blocks is not processed. These markers are replaced with their
			// associated code blocs after selects have been processed.
			content = content.replace(item, codeMarker);

			return codeMarker;
		});

		const selectTheme = settings.theme === "none"
			? ""
			: `${classNames.selectBlock}--${settings.theme}`;

		let selectBlockMatch;
		let selectMatch;

		let isFirst = true;

		// Process each select block
		while (
			(selectBlockMatch = regex.selectBlockMarkup.exec(content)) !== null
		) {
			let selectBlock = selectBlockMatch[0];
			let selectGroups: string[] = [];
			let selectStartReplacement = "";
			let selectEndReplacement = "";

			// Headings
			const hasSelectHeadings = regex.selectHeadingMarkup.test(selectBlock);
			const selectBlockIndent = selectBlockMatch[1];
			const selectBlockStart = selectBlockMatch[2];
			const selectBlockEnd = selectBlockMatch[4];

			// Labels
			const selectMenuLabelsMatch = regex.selectMenuLabelsMarkup.exec(
				selectBlock,
			);
			const selectMenuLabels = selectMenuLabelsMatch &&
				selectMenuLabelsMatch[3].split(",");

			if (hasSelectHeadings) {
				// ### selectGroup1, selectGroup2
				// Process each select group
				type Option = { [key: string]: string };
				const selectGroupOptions: Option[] = [];

				// Generate <options>
				while (
					(selectMatch = regex.selectHeadingMarkup.exec(selectBlock)) !== null
				) {
					const selectOptions = selectMatch[2].trim().split(",");
					const selectContent = (selectMatch[3] || "").trim();
					const dataSelectContentAttribute = prepareDataSelectAttribute(
						selectOptions
							.toString()
							.toLowerCase()
							.trim()
							.split(/[,\s]/g)
							.join("-"),
					);

					let classAttribute = classNames.selectContent;
					// Show the first block by default.
					if (isFirst) {
						classAttribute += ` ${classNames.selectContentActive}`;
					}

					selectBlock = selectBlock.replace(
						selectMatch[0],
						[
							`\n${selectBlockIndent}<!-- ${commentReplaceMark} <div class="${classAttribute}" data-select-content="${dataSelectContentAttribute}"> -->`,
							`\n\n${selectBlockIndent}${selectContent}`,
							`\n\n${selectBlockIndent}<!-- ${commentReplaceMark} </div> -->`,
						].join(""),
					);

					for (const [index, selectOption] of selectOptions.entries()) {
						// Options is a object/dict so we can de-dupe the <options> list when the same value repeats (as happens when using multiple select lists in combination)
						// eg: macOS,bash | macOS,linux
						if (
							selectOption.toLowerCase().trim().split(" ").join("-") !==
								"docsify-select-default"
						) {
							const options: Option = selectGroupOptions[index] || [];
							options[selectOption] =
								`${selectBlockIndent} <option value="${selectOption.toLowerCase()}">${selectOption}</option>`;
							selectGroupOptions[index] = options;
						}
					}

					isFirst = false;
				}

				if (selectMenuLabels) {
					for (const [index, selectMenuLabel] of selectMenuLabels.entries()) {
						selectGroups = [
							...selectGroups,
							`<div class="${classNames.selectMenuContainer}"> <label for="${selectMenuLabel.toLowerCase()}">${selectMenuLabel}</label> <select class="${classNames.selectMenu}" id="${
								selectMenuLabel.toLowerCase().replace(/\s/g, "-")
							}"> ${Object.values(selectGroupOptions[index])} </select> </div>`,
						];
					}
				}

				selectStartReplacement = `<!-- ${commentReplaceMark} <div class="${
					[classNames.selectBlock, selectTheme].join(" ")
				}"> <div class="${classNames.selectGroup}"> ${
					selectGroups.toString().split(",").join(" ")
				} </div> -->`;
				selectEndReplacement =
					`\n${selectBlockIndent}<!-- ${commentReplaceMark} </div> -->`;
			}

			selectBlock = selectBlock.replace(
				selectBlockStart,
				selectStartReplacement,
			);
			selectBlock = selectBlock.replace(selectBlockEnd, selectEndReplacement);
			content = content.replace(selectBlockMatch[0], selectBlock);
		}

		// Restore code blocks
		for (const [index, item] of codeBlockMarkers.entries()) {
			content = content.replace(item, codeBlockMatch[index]);
		}

		return content;
	}

	/**
	 * Converts "stage 1" markup into final markup by replacing temporary comments
	 * with HTML.
	 */
	function renderSelectGroupsStage2(html: string): string {
		let selectReplaceMatch;

		while (
			(selectReplaceMatch = regex.commentReplaceMarkup.exec(html)) !== null
		) {
			const selectComment = selectReplaceMatch[0];
			const selectReplacement = selectReplaceMatch[1] || "";

			html = html.replace(selectComment, selectReplacement);
		}

		return html;
	}

	/**
	 * Get the Operating System name.
	 *
	 * Credit: https://stackoverflow.com/a/19176790/7911479
	 */
	function getOperatingSystemName(): string {
		let operatingSystemName = "Unknown";
		// If (window.navigator.userAgent.includes('Windows NT 10.0')) {
		// 	operatingSystemName = 'Windows 10';
		// }

		// if (window.navigator.userAgent.includes('Windows NT 6.2')) {
		// 	operatingSystemName = 'Windows 8';
		// }

		// if (window.navigator.userAgent.includes('Windows NT 6.1')) {
		// 	operatingSystemName = 'Windows 7';
		// }

		// if (window.navigator.userAgent.includes('Windows NT 6.0')) {
		// 	operatingSystemName = 'Windows Vista';
		// }

		// if (window.navigator.userAgent.includes('Windows NT 5.1')) {
		// 	operatingSystemName = 'Windows XP';
		// }

		// if (window.navigator.userAgent.includes('Windows NT 5.0')) {
		// 	operatingSystemName = 'Windows 2000';
		// }

		if (window.navigator.userAgent.includes("Win")) {
			operatingSystemName = "Windows";
		}

		if (window.navigator.userAgent.includes("Mac")) {
			operatingSystemName = "macOS";
		}

		if (window.navigator.userAgent.includes("X11")) {
			operatingSystemName = "UNIX";
		}

		if (window.navigator.userAgent.includes("Linux")) {
			operatingSystemName = "Linux";
		}

		return operatingSystemName;
	}

	function prepareDataSelectAttribute(string: string): string {
		return string.toLowerCase().trim().split(/[,\s]/g).join("-");
	}

	function calculateSelectedContent(
		selectMenuList: NodeListOf<Element>,
	): string {
		let newSelection = "";
		Array.prototype.forEach.call(selectMenuList, (selectMenu) => {
			newSelection = (newSelection.length === 0)
				? prepareDataSelectAttribute(selectMenu.value)
				: newSelection + "-" + prepareDataSelectAttribute(selectMenu.value);
		});
		return newSelection;
	}

	function setSelectedContent(
		newSelection: string,
		selectContentList: NodeListOf<Element>,
	): boolean {
		let contentMatch = false;
		for (const selectContent of Array.from(selectContentList)) {
			selectContent.classList.remove(classNames.selectContentActive);
			if (selectContent.getAttribute("data-select-content") === newSelection) {
				selectContent.classList.add(classNames.selectContentActive);
				contentMatch = true;
			}
		}

		return contentMatch;
	}

	function setDefaultContent(selectContentList: NodeListOf<Element>): void {
		for (const selectContent of Array.from(selectContentList)) {
			if (
				selectContent.getAttribute("data-select-content") ===
					"docsify-select-default"
			) {
				selectContent.classList.add(classNames.selectContentActive);
			}
		}
	}

	/**
	 * Sets the initial active select for each select group. Either top option of each select or the matching operating-system value.
	 */
	function setInitialSelection(
		selectMenuList: NodeListOf<Element>,
		selectContentList: NodeListOf<Element>,
	) {
		if (settings.detectOperatingSystem.enabled) {
			// Set the select menu options
			const currentOperatingSystem = getOperatingSystemName();
			Array.prototype.forEach.call(selectMenuList, (selectMenu) => {
				// If id = settings.detectOperatingSystem.menuId
				if (selectMenu.id === settings.detectOperatingSystem.menuId) {
					// Set the value to be the detected OS if in the list of options
					Array.prototype.forEach.call(selectMenu.options, (option, index) => {
						if (
							option.value.toString().trim().toLowerCase().includes(
								currentOperatingSystem.toLowerCase(),
							)
						) {
							selectMenu.selectedIndex = index;
						} else {
							selectMenu.selectedIndex = 0;
						}
					});
				}
			});

			// Now do the same as changeSelection function
			const newSelection = calculateSelectedContent(selectMenuList);
			const contentMatch = setSelectedContent(newSelection, selectContentList);
			// If at this point no element has the 'data-select-content' value, then set the default if it exists
			if (contentMatch === false) {
				setDefaultContent(selectContentList);
			}
		}
	}

	function changeSelection(
		selectMenuList: NodeListOf<Element>,
		selectContentList: NodeListOf<Element>,
	) {
		// Change the styles applied to the elements with class .docsify-select__content in this block according to the combination of selectMenu values
		// set all selectContent values to nothing
		// set current selectContent values with matching 'data-select-content' to selectContentActive
		const newSelection = calculateSelectedContent(selectMenuList);
		const contentMatch = setSelectedContent(newSelection, selectContentList);

		// If at this point no element has the 'data-select-content' value, then set the default if it exists
		if (contentMatch === false) {
			setDefaultContent(selectContentList);
		}
	}

	function changeAllSyncedSelections(
		selectBlocks: NodeListOf<Element>,
		selectMenuId: string,
		selectOption: string,
	) {
		// Set selected again to persist across page jumps.
		settings.selected[selectMenuId] = selectOption;

		// For each selectBlock, if it contains a menu matching selectMenuId
		for (const selectBlock of Array.from(selectBlocks)) {
			const selectContentList = selectBlock.querySelectorAll(
				`.${classNames.selectContent}`,
			);
			const selectMenuList = selectBlock.querySelectorAll(
				`.${classNames.selectMenu}`,
			);
			for (const selectMenu of Array.from(selectMenuList)) {
				if (selectMenu.id === selectMenuId) {
					// @ts-expect-error: fix this type in future
					Array.prototype.forEach.call(selectMenu.options, (option, index) => {
						if (option.value === selectOption) {
							// @ts-expect-error: fix this type in future
							selectMenu.selectedIndex = index;
						}
					});
				}
			}

			// Now do the same as changeSelection function
			const newSelection = calculateSelectedContent(selectMenuList);
			const contentMatch = setSelectedContent(newSelection, selectContentList);
			// If at this point no element has the 'data-select-content' value, then set the default if it exists
			if (contentMatch === false) {
				setDefaultContent(selectContentList);
			}
		}
	}

	// Plugin
	// =============================================================================

	// docs: https://docsify.js.org/#/write-a-plugin?id=lifecycle-hooks
	type hook = {
		beforeEach: (fn: (markdown: string) => string) => void;
		afterEach: (
			fn: (html: string, next: (html: string) => void) => void,
		) => void;
		doneEach: (fn: () => void) => void;
		mounted: (fn: () => void) => void;
	};

	const docsifySelect: DocsifyPlugin = function (hook, _) {
		// shared state
		let hasSelect = false;

		hook.mounted(() => {});

		hook.beforeEach((markdown: string): string => {
			hasSelect = regex.selectBlockMarkup.test(markdown);
			if (hasSelect) {
				markdown = renderSelectGroupsStage1(markdown);
			}

			return markdown;
		});

		hook.afterEach((html, next) => {
			if (hasSelect) {
				html = renderSelectGroupsStage2(html);
			}

			next(html);
		});

		hook.doneEach(() => {
			// eslint-disable-next-line no-warning-comments
			// TODO(jthegedus): see if can be moved to onClick event of entire content block (like in docsify-tabs)
			if (hasSelect) {
				const selectContainer = document.querySelector(
					`.${classNames.selectContainer}`,
				);
				if (selectContainer) {
					const selectBlocks = selectContainer.querySelectorAll(
						`.${classNames.selectBlock}`,
					);
					if (selectBlocks.length > 0) {
						// Set preselected selections from settings.
						for (const x of Object.keys(settings.selected)) {
							changeAllSyncedSelections(selectBlocks, x, settings.selected[x]);
						}

						for (const selectBlock of Array.from(selectBlocks)) {
							const selectMenuList = selectBlock.querySelectorAll(
								`.${classNames.selectMenu}`,
							);
							const selectContentList = selectBlock.querySelectorAll(
								`.${classNames.selectContent}`,
							);
							// Set initial selection based on MenuList & SelectContent in SelectBlock
							setInitialSelection(selectMenuList, selectContentList);
							for (const selectMenu of Array.from(selectMenuList)) {
								// Set change handler
								selectMenu.addEventListener("change", (event: Event) => {
									if (settings.sync && event?.target) {
										changeAllSyncedSelections(
											selectBlocks,
											// @ts-expect-error: what the hell type should this be? Google only returned React BS
											event.target.id,
											// @ts-expect-error: what the hell type should this be? Google only returned React BS
											event.target.value,
										);
									} else {
										// Change selection for MenuList & SelectContent in SelectBlock
										changeSelection(selectMenuList, selectContentList);
									}
								});
							}
						}
					}
				}
			}
		});
	};

	type DocsifyPlugin = (hook: hook, vm: any) => void;
	type Docsify = {
		plugins: DocsifyPlugin[];
		select: typeof settings;
	};

	type WindowWithDocsify =
		| Window & typeof globalThis & { $docsify: Docsify | null | undefined }
		| null
		| undefined;

	// Immediately invoked function expression
	const windowWithDocsify = window as WindowWithDocsify;
	if (windowWithDocsify) {
		const selectDefaults = { ...settings };

		// if no $docsify object, create it with this plugins default values
		windowWithDocsify.$docsify = windowWithDocsify.$docsify || {
			plugins: [],
			select: selectDefaults,
		};

		// if $docsify object, but no select plugin settings, add this plugins default values
		windowWithDocsify.$docsify.select = windowWithDocsify.$docsify.select ||
			selectDefaults;

		// if $docsify.select plugin settings provided, then apply them
		for (const key in windowWithDocsify.$docsify.select) {
			if (key in settings) {
				// @ts-expect-error: if code reaches here, then key is in settings
				settings[key] = windowWithDocsify.$docsify.select[key];
			}
		}

		if (settings.useSelectHeadingComment) {
			// Swap these around. Kind of dirty doing it this way.
			regex.selectHeadingMarkup = regex.selectHeadingComment;
		}

		// Init plugin
		windowWithDocsify.$docsify.plugins = ([] as DocsifyPlugin[]).concat(
			docsifySelect,
			windowWithDocsify.$docsify.plugins || [],
		);
	}
})();
