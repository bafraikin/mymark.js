class Mark {
	constructor() {
		Mark.div = Mark.div || document.querySelector('#isSelectionable');
		this.failed = false;
		if (!Mark.div)
			return ;
		this.get_selection = this.correct_selection(this.saveSelection());
		if (!this.failed)
		{
		Mark._number = Mark._number + 1 || 0;
		this._number = Mark._number;
		}
	}

	static get number() {
		return Mark._number || 0;
	}

	get content() {
		let text = "";
		const content = document.querySelectorAll(`.mark${this._number}`);
		for (let node of content.values()) {
			text += node.innerText;
		}
		return text;
	}

	children_HTMLcollection_to_array() {
		return [].slice.call(Mark.div.children);
	}

	is_node_in_container(container, node) {
		if (node === Mark.div || node === document.body)
			return false;
		if (node === container)
			return true;
		return this.is_node_in_container(container, node.parentNode);
	}

	begin_node(node) {
		if (this.is_node_in_container(this.get_a_node(node), this.get_a_node(this.get_selection.startContainer)))
			return true;
		return false;
	}

	end_node(node) {
		if (this.is_node_in_container(this.get_a_node(node), this.get_a_node(this.get_selection.endContainer)))
			return true;
		return false;
	}

	begin_or_end_node(node) {
		if (this.begin_node(node) || this.end_node(node))
			return true;
		return false;
	}

	begin_and_end_node(node) {
		if (this.begin_node(node) && this.end_node(node))
			return true;
		return false;
	}

	good_selection(range) {
			if (range.startContainer === range.endContainer && (range.startOffset === range.endOffset || range.endOffset - range.startOffset < 3))
				return false;
		return true;
	}

	correct_selection(get_selection) {
		let range = document.createRange();
		let div = Mark.div;
		range.selectNodeContents(div);

		if (get_selection.intersectsNode(div) && this.good_selection(get_selection))
		{
			if (!this.is_include_in(div, get_selection.startContainer))
				get_selection.setStart(div, 0);
			if (!this.is_include_in(div, get_selection.endContainer))
				get_selection.setEnd(div, range.endOffset);
			return get_selection;
		}
		this.failed = true;
		return null;
	}

	create_spare_node(node) {
		let spare_node = document.createElement(node.nodeName)
			if (node.classList.length > 0)
				spare_node.classList = node.classList; 
		let parts = spare_node.outerHTML.match(/<[^>]+>/g);
		return parts; 
	}

	wrap_inside_node() {
		let range = this.get_selection
			let node = this.get_a_node(range.startContainer);
		let html = node.innerHTML;
		let parts = this.create_spare_node(node);
		html = this.insert_text_in_text(html, this.end_mark(parts[0]), range.endOffset);
		html = this.insert_text_in_text(html, this.start_mark(parts[1]), range.startOffset);
		
		/*html = this.insert_text_in_text(html, parts[0], 0);
		html = this.insert_text_in_text(html, parts[1], html.length);
		*/
		node.innerHTML = html;
	}

	wrap_begin_node() {
		let range = this.get_selection
			let node = this.get_a_node(range.startContainer);
		let html = node.innerHTML;
		let parts = this.create_spare_node(node);
		html =  this.insert_text_in_text(html, this.end_mark(parts[0]), html.length);
		html =  this.insert_text_in_text(html, this.start_mark(parts[1]), range.startOffset);
		node.innerHTML = html;
	}

	wrap_end_node() {
		let range = this.get_selection
			let node = this.get_a_node(range.endContainer);
		let html = node.innerHTML;
		let parts = this.create_spare_node(node);
		html =  this.insert_text_in_text(html, this.end_mark(parts[0]), range.endOffset);
		html =  this.insert_text_in_text(html, this.start_mark(parts[1]), 0);
		node.innerHTML = html;
	}


	wrap_selection()
	{
		let array = this.children_HTMLcollection_to_array();
		let bool = Mark.div === this.get_selection.startContainer;
		if (this.begin_and_end_node(this.get_selection.startContainer) && !bool)
		{
			this.wrap_inside_node();
		}
		else {
			for (var node of array) {
				if (this.begin_node(node))
				{
					this.wrap_begin_node(node);
					bool = true;
				}        
				if (bool && !this.begin_or_end_node(node))
					this.wrap_node(node);
				if (this.end_node(node))
				{
					this.wrap_end_node(node);
					break;
				}
			}
			this.get_selection.collapse();
		}
	}

	insert_text_in_text(dest, text, index)
	{
		let before = dest.slice(0,index);
		let after = dest.slice(index);
		return (before + text + after);
	}

	is_include_in(div, to_find) {
		to_find = this.get_a_node(to_find);
		let children = div.querySelectorAll(to_find.nodeName);
		for(var key of children.values()) { 
			if (key == to_find)
				return true;
		}
		return false;
	} 

	create_surround_node() {
		let mark = document.createElement(`mark${this._number}`);
		mark.classList.add(`mark${this._number}`);
		mark.classList.add('cas_general');
		mark.classList.add('mark');
		return (mark);
	}

	start_mark(part) {
		return part + '<mark' + this._number + ' class="mark' + this._number + " cas_general mark" + '">';
	}

	end_mark(part) {
		return '</mark' + this._number + '>' + part;
	}

	wrap_node(node) {
		let range = document.createRange();
		range.selectNodeContents(node);
		range.surroundContents(this.create_surround_node());
	}

	get_a_node(something) {
		if (something.nodeType === Node.TEXT_NODE)
			return this.get_a_node(something.parentNode);
		return something;
	}

	saveSelection() {
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
}

document.body.addEventListener("mouseup", () =>{
	a = new Mark();
	console.log(a);
	if (!a.failed)
	{
		a.wrap_selection();
		console.log(a.content);
	}
})

