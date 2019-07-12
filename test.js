function saveSelection() {
	if (window.getSelection) {
		var sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			return sel.getRangeAt(0);
		}
	} else if (document.selection && document.selection.createRange) {
		return document.selection.createRange();
	}
	return null;
}

function is_include_in(div, to_find) {

	if (to_find.nodeType === Node.TEXT_NODE)
		to_find = to_find.parentNode;
	for(var key of div.childNodes.values()) { 
		if (key == to_find)
		{
			return true;
		}
	}
	return false;
}

function get_a_node(something) {
	if (something.nodeType === Node.TEXT_NODE)
		return get_a_node(something.parentNode);
	return something;
}

function insert_text_in_text(dest, text, index)
{
	let before = dest.slice(0,index);
	let after = dest.slice(index);
	return (before + text + after);
}

function children_HTMLcollection_to_array(div)
{
	return [].slice.call(div.children);
}

function find_good_part(div, container) {
	let children_array = children_HTMLcollection_to_array(div);
	let index_container = children_array.indexOf(container);
}

function sumurize_offset_till_container_index(children_array, index_container) {
	const to_reduce = children_array.slice(0,index_container);
	const reducer = function(current_value, next_value)  { return (current_value + next_value.outerHTML.length + 1) }
	return to_reduce.reduce((reducer), 0);
}

document.addEventListener('mouseup', () => {
	let get_selection = saveSelection();
	let div = document.querySelector('#isSelectionable');
	let range = document.createRange();
	range.selectNodeContents(div);
	var instance = new Mark(div);

	if (get_selection.intersectsNode(div))
	{
		if (!is_include_in(div, get_selection.startContainer))
		{
			get_selection.setStart(div, 0);
		}
		if (!is_include_in(div, get_selection.endContainer))
		{
			get_selection.setEnd(div, range.endOffset);
		}
	}
	debugger;
});

