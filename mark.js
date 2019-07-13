class Mark {

  constructor() {
    Mark.div = Mark.div || document.querySelector('#isSelectionable');
    this.failed = true;
    if (!Mark.div)
      return ;
    this.failed = false;
    Mark._number = Mark._number + 1 || 0;
    this._number = Mark._number;
    this.get_selection = this.correct_selection(this.saveSelection());
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

  begin_node(node) {
    if (this.get_a_node(this.get_selection.startContainer) === this.get_a_node(node))
      return true;
    return false;
  }

  end_node(node) {
    if (this.get_a_node(this.get_selection.endContainer) === this.get_a_node(node))
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

  correct_selection(get_selection) {
    let range = document.createRange();
    let div = Mark.div;
    range.selectNodeContents(div);

    if (get_selection.intersectsNode(div))
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

  wrap_inside_node() {
    let range = this.get_selection
    let node = range.startContainer;
    node = this.get_a_node(node);
    let html = node.innerHTML;
    html =  this.insert_text_in_text(html, '</mark>', range.endOffset);
    html =  this.insert_text_in_text(html, this.start_head(), range.startOffset);
    node.innerHTML = html;
  }

  wrap_begin_node(node) {
    let range = this.get_selection
    node = this.get_a_node(node);
    let html = node.innerHTML;
    html =  this.insert_text_in_text(html, '</mark>', html.length);
    html =  this.insert_text_in_text(html, this.start_head(), range.startOffset);
    node.innerHTML = html;
  }

  wrap_end_node(node) {
    let range = this.get_selection
    node = this.get_a_node(node);
    let html = node.innerHTML;
    html =  this.insert_text_in_text(html, '</mark>', range.endOffset);
    html =  this.insert_text_in_text(html, this.start_head(), 0);
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
    for(var key of div.childNodes.values()) { 
      if (key == to_find)
      {
        return true;
      }
    }
    return false;
  }

  create_surround_node() {
    let mark = document.createElement('mark');
    mark.classList.add(`mark${this._number}`);
    mark.classList.add('cas_general');
    return (mark);
  }

  start_head() {
    return '<mark class="mark' + this._number + " cas_general" + '">';
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
