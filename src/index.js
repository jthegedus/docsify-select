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

function prepareDataSelectAttribute(string) {
	return string.toLowerCase().trim().split(/[,\s]/g).join('-');
}

/**
 * Sets the initial active select for each select group (the first select in the group)
 */
function setInitialSelection(selectContentList) {
	selectContentList[0].classList.add(classNames.selectContentActive);
}

function changeSelection(event, selectMenuList, selectContentList) {
	// Change the styles applied to the elements with class .docsify-select__content in this block according to the combination of selectMenu values
	// set all selectContent values to nothing
	// set current selectContent values with matching 'data-select-content' to selectContentActive
	let newSelection = '';
	Array.prototype.forEach.call(selectMenuList, selectMenu => {
		newSelection = (newSelection.length === 0) ?
			prepareDataSelectAttribute(selectMenu.value) :
			newSelection + '-' + prepareDataSelectAttribute(selectMenu.value);
	});

	let contentMatch = false;
	selectContentList.forEach(selectContent => {
		selectContent.classList.remove(classNames.selectContentActive);
		if (selectContent.getAttribute('data-select-content') === newSelection) {
			selectContent.classList.add(classNames.selectContentActive);
			contentMatch = true;
		}
	});

	// If at this point no element has the 'data-select-content' value, then set the default if it exists
	if (contentMatch === false) {
		selectContentList.forEach(selectContent => {
			if (selectContent.getAttribute('data-select-content') === 'docsify-select-default') {
				selectContent.classList.add(classNames.selectContentActive);
			}
		});
	}
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
			const isSelectBlocks = selectContainer.querySelectorAll(`.${classNames.selectBlock}`);
			if (isSelectBlocks.length !== 0) {
				isSelectBlocks.forEach(selectBlock => {
					const selectMenuList = selectBlock.querySelectorAll(`.${classNames.selectMenu}`);
					const selectContentList = selectBlock.querySelectorAll(`.${classNames.selectContent}`);
					setInitialSelection(selectContentList);
					selectMenuList.forEach(selectMenu => {
						selectMenu.addEventListener('change', event => {
							// Change selection based on MenuList & SelectContent in Block
							changeSelection(event, selectMenuList, selectContentList);
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
