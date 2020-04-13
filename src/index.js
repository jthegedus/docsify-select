import {version as pkgVersion} from '../package.json';

// eslint-disable-next-line import/no-unassigned-import
import './styles.css';

// As
// let css = fs.readFileSync('./style.css'); // <-- The css reader
// let style = document.createElement('style');
// style.type = 'text/css';
// style.append(document.createTextNode(css));
// document.head.append(style);
// As
const commentReplaceMark = 'select:replace';
const classNames = {
	selectContainer: 'content',
	selectBlock: 'docsify-select',
	selectMenu: 'docsify-select-menu',
	selectOption: 'docsify-select__option',
	selectContent: 'docsify-select__content',
	selectContentActive: 'docsify-select__content--active'
};

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
	selectBlockMarkup: /[\r\n]*(\s*)(<!-+\s+select:\s*?start\s+-+>)[\r\n]+([\s|\S]*?)[\r\n\s]+(<!-+\s+select:\s*?end\s+-+>)/m,

	// Matches select lables by select-label comment
	// given - <!-- select-menu-labels: some,labels -->
	// 0: Match
	// 1: Indent
	// 2: Comment: <!-- select-menu-labels:
	// 3: Menu Labels: some,labels
	// 4: Comment tail: -->
	selectMenuLabelsMarkup: /[\r\n]*(\s*)(<!-+\s+select-menu-labels:\s*)([\s|\S]*?)(\s+-+>)/m,

	// Matches select option and content
	// 0: Match
	// 1: Option: #### --Label-- OR #### ~~Label~~
	// 2: Content
	selectHeadingMarkup: /[\r\n]*(\s*)#{1,6}\s*[~-]{2}\s*(.*[^\s])\s*[~-]{2}[\r\n]+([\s\S]*?)(?=#{1,6}\s*[~-]{2}|<!-+\s+select:\s*?end\s+-+>)/m
};

const settings = {
	sync: false,
	detectOperatingSystem: {enabled: false, menuId: 'operating-system'},
	theme: 'classic'
};

// Functions
// =============================================================================
/**
 * Converts select content into "stage 1" markup. Stage 1 markup contains temporary
 * comments which are replaced with HTML during Stage 2. This approach allows
 * all markdown to be converted to HTML before select-specific HTML is added.
 *
 * @param {string} content
 * @returns {string}
 */
function renderSelectGroupsStage1(content) {
	const codeBlockMatch = content.match(regex.codeMarkup) || [];
	const codeBlockMarkers = codeBlockMatch.map((item, i) => {
		const codeMarker = `<!-- ${commentReplaceMark} CODEBLOCK${i} -->`;

		// Replace code block with marker to ensure select markup within code
		// blocks is not processed. These markers are replaced with their
		// associated code blocs after selects have been processed.
		content = content.replace(item, codeMarker);

		return codeMarker;
	});

	const selectTheme = settings.theme ? `${classNames.selectBlock}--${settings.theme}` : '';

	let selectBlockMatch;
	let selectMatch;

	// Process each select block
	while ((selectBlockMatch = regex.selectBlockMarkup.exec(content)) !== null) {
		let selectBlock = selectBlockMatch[0];
		let selectGroups = [];
		let selectStartReplacement = '';
		let selectEndReplacement = '';

		// Headings
		const hasSelectHeadings = regex.selectHeadingMarkup.test(selectBlock);
		const selectBlockIndent = selectBlockMatch[1];
		const selectBlockStart = selectBlockMatch[2];
		const selectBlockEnd = selectBlockMatch[4];

		// Labels
		const selectMenuLabelsMatch = regex.selectMenuLabelsMarkup.exec(selectBlock);
		const selectMenuLabels = selectMenuLabelsMatch[3].split(',');

		if (hasSelectHeadings) {
			// ### selectGroup1, selectGroup2
			// Process each select group
			const selectGroupOptions = [];

			// Generate <options>
			while ((selectMatch = regex.selectHeadingMarkup.exec(selectBlock)) !== null) {
				const selectOptions = selectMatch[2].trim().split(',');
				const selectContent = (selectMatch[3] || '').trim();
				const dataSelectContentAttribute = prepareDataSelectAttribute(
					selectOptions
						.toString()
						.toLowerCase()
						.trim()
						.split(/[,\s]/g)
						.join('-')
				);

				selectBlock = selectBlock.replace(selectMatch[0], [
					`\n${selectBlockIndent}<!-- ${commentReplaceMark} <div class="${classNames.selectContent}" data-select-content="${dataSelectContentAttribute}"> -->`,
					`\n\n${selectBlockIndent}${selectContent}`,
					`\n\n${selectBlockIndent}<!-- ${commentReplaceMark} </div> -->`
				].join(''));

				selectOptions.forEach((selectOption, index) => {
					// Options is a object/dict so we can de-dupe the <options> list when the same value repeats (as happens when using multiple select lists in combination)
					// eg: macOS,bash | macOS,linux
					if (selectOption.toLowerCase().trim().split(' ').join('-') !== 'docsify-select-default') {
						const options = selectGroupOptions[index] || [];
						options[selectOption] = `${selectBlockIndent} <option value="${selectOption.toLowerCase()}">${selectOption}</option>`;
						selectGroupOptions[index] = options;
					}
				});
			}

			selectMenuLabels.forEach((selectMenuLabel, index) => {
				selectGroups = [
					...selectGroups,
					`<label for="${selectMenuLabel.toLowerCase()}">${selectMenuLabel}</label> <select class="${classNames.selectMenu}" id="${selectMenuLabel.toLowerCase().replace(/\s/g, '-')}"> ${Object.values(selectGroupOptions[index])} </select>`
				];
			});

			selectStartReplacement = `<!-- ${commentReplaceMark} <div class="${[classNames.selectBlock, selectTheme].join(' ')}"> ${selectGroups.toString().split(',').join(' ')} -->`;
			selectEndReplacement = `\n${selectBlockIndent}<!-- ${commentReplaceMark} </div> -->`;
		}

		selectBlock = selectBlock.replace(selectBlockStart, selectStartReplacement);
		selectBlock = selectBlock.replace(selectBlockEnd, selectEndReplacement);
		content = content.replace(selectBlockMatch[0], selectBlock);
	}

	// Restore code blocks
	codeBlockMarkers.forEach((item, i) => {
		content = content.replace(item, codeBlockMatch[i]);
	});

	return content;
}

/**
 * Converts "stage 1" markup into final markup by replacing temporary comments
 * with HTML.
 *
 * @param {string} html
 * @returns {string}
 */
function renderSelectGroupsStage2(html) {
	let selectReplaceMatch;

	while ((selectReplaceMatch = regex.commentReplaceMarkup.exec(html)) !== null) {
		const selectComment = selectReplaceMatch[0];
		const selectReplacement = selectReplaceMatch[1] || '';

		html = html.replace(selectComment, selectReplacement);
	}

	return html;
}

/**
 * Get the Operating System name.
 *
 * Credit: https://stackoverflow.com/a/19176790/7911479
 *
 * @returns {string}
 */
function getOperatingSystemName() {
	let operatingSystemName = 'Unknown';
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

	if (window.navigator.userAgent.includes('Win')) {
		operatingSystemName = 'Windows';
	}

	if (window.navigator.userAgent.includes('Mac')) {
		operatingSystemName = 'macOS';
	}

	if (window.navigator.userAgent.includes('X11')) {
		operatingSystemName = 'UNIX';
	}

	if (window.navigator.userAgent.includes('Linux')) {
		operatingSystemName = 'Linux';
	}

	return operatingSystemName;
}

function prepareDataSelectAttribute(string) {
	return string.toLowerCase().trim().split(/[,\s]/g).join('-');
}

function calculateSelectedContent(selectMenuList) {
	let newSelection = '';
	Array.prototype.forEach.call(selectMenuList, selectMenu => {
		newSelection = (newSelection.length === 0) ?
			prepareDataSelectAttribute(selectMenu.value) :
			newSelection + '-' + prepareDataSelectAttribute(selectMenu.value);
	});
	return newSelection;
}

function setSelectedContent(newSelection, selectContentList) {
	let contentMatch = false;
	selectContentList.forEach(selectContent => {
		selectContent.classList.remove(classNames.selectContentActive);
		if (selectContent.getAttribute('data-select-content') === newSelection) {
			selectContent.classList.add(classNames.selectContentActive);
			contentMatch = true;
		}
	});
	return contentMatch;
}

function setDefaultContent(selectContentList) {
	selectContentList.forEach(selectContent => {
		if (selectContent.getAttribute('data-select-content') === 'docsify-select-default') {
			selectContent.classList.add(classNames.selectContentActive);
		}
	});
}

/**
 * Sets the initial active select for each select group. Either top option of each select or the matching operating-system value.
 */
function setInitialSelection(selectMenuList, selectContentList) {
	if (settings.detectOperatingSystem.enabled) {
		// Set the select menu options
		const currentOperatingSystem = getOperatingSystemName();
		Array.prototype.forEach.call(selectMenuList, selectMenu => {
			// If id = settings.detectOperatingSystem.menuId
			if (selectMenu.id === settings.detectOperatingSystem.menuId) {
				// Set the value to be the detected OS if in the list of options
				Array.prototype.forEach.call(selectMenu.options, (option, index) => {
					if (option.value.toString().trim().toLowerCase().includes(currentOperatingSystem.toLowerCase())) {
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

function changeSelection(event, selectMenuList, selectContentList) {
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

function changeAllSyncedSelections(event, selectBlocks) {
	// Get selectMenuId
	const selectMenuId = event.target.id;
	const selectOption = event.target.value;

	// For each selectBlock, if it contains a menu matching selectMenuId
	selectBlocks.forEach(selectBlock => {
		const selectContentList = selectBlock.querySelectorAll(`.${classNames.selectContent}`);
		const selectMenuList = selectBlock.querySelectorAll(`.${classNames.selectMenu}`);
		selectMenuList.forEach(selectMenu => {
			if (selectMenu.id === selectMenuId) {
				Array.prototype.forEach.call(selectMenu.options, (option, index) => {
					if (option.value === selectOption) {
						selectMenu.selectedIndex = index;
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
	});
}

// Plugin
// =============================================================================
function docsifySelect(hook, _) {
	let hasSelect = false;
	hook.beforeEach(content => {
		hasSelect = regex.selectBlockMarkup.test(content);
		if (hasSelect) {
			content = renderSelectGroupsStage1(content);
		}

		return content;
	});

	hook.afterEach((html, next) => {
		if (hasSelect) {
			html = renderSelectGroupsStage2(html);
		}

		next(html);
	});

	hook.doneEach(() => {
		// eslint-disable-next-line no-warning-comments
		// TODO: see if can be moved to onClick event of entire content block (like in docsify-tabs)
		if (hasSelect) {
			const selectContainer = document.querySelector(`.${classNames.selectContainer}`);
			const selectBlocks = selectContainer.querySelectorAll(`.${classNames.selectBlock}`);
			if (selectBlocks.length !== 0) {
				selectBlocks.forEach(selectBlock => {
					const selectMenuList = selectBlock.querySelectorAll(`.${classNames.selectMenu}`);
					const selectContentList = selectBlock.querySelectorAll(`.${classNames.selectContent}`);
					// Set initial selection based on MenuList & SelectContent in SelectBlock
					setInitialSelection(selectMenuList, selectContentList);
					selectMenuList.forEach(selectMenu => {
						// Set change handler
						selectMenu.addEventListener('change', event => {
							if (settings.sync) {
								changeAllSyncedSelections(event, selectBlocks);
							} else {
								// Change selection for MenuList & SelectContent in SelectBlock
								changeSelection(event, selectMenuList, selectContentList);
							}
						});
					});
				});
			}
		}
	});

	hook.mounted(() => {
	});
}

if (window) {
	window.$docsify = window.$docsify || {};

	// Add config object
	window.$docsify.select = window.$docsify.select || {};

	// Update settings based on $docsify config
	Object.keys(window.$docsify.select).forEach(key => {
		if (Object.prototype.hasOwnProperty.call(settings, key)) {
			settings[key] = window.$docsify.select[key];
		}
	});

	// Add plugin data
	window.$docsify.select.version = pkgVersion;

	// Init plugin
	window.$docsify.plugins = [].concat(
		docsifySelect,
		(window.$docsify.plugins || [])
	);
}
