import { useEffect, useRef, useState } from "react";

const useWidgetLogic = ({ widget, isEditable, onContentChange, onSelect, editorRef }) => {
  const ref = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEmpty = widget.type === 'richText' && (!widget.props.content || widget.props.content.trim() === '' || widget.props.content === '<p></p>');
  const isHeadingEmpty = widget.type === 'heading' && (!widget.props.text || widget.props.text.trim() === '' || widget.props.text === '<p></p>');

  // Handle rich text content updates
  useEffect(() => {
    if (widget.type === 'richText' && ref.current) {
      if (isEmpty && isEditable) {
        ref.current.innerHTML = '';
      } else if (widget.props.content && ref.current.innerHTML !== widget.props.content) {
        const currentContent = ref.current.innerHTML;
        const newContent = widget.props.content || '<p>Start writing...</p>';
        if (currentContent !== newContent) {
          ref.current.innerHTML = newContent;
        }
      }
    }
  }, [widget.type, widget.props.content, isEmpty, isEditable]);

  // Handle heading content updates
  useEffect(() => {
    if (widget.type === 'heading' && ref.current) {
      if (isHeadingEmpty && isEditable) {
        ref.current.innerHTML = '';
      } else if (widget.props.text && ref.current.innerHTML !== widget.props.text) {
        const currentContent = ref.current.innerHTML;
        const newContent = widget.props.text || '';
        if (currentContent !== newContent) {
          ref.current.innerHTML = newContent;
        }
      }
    }
  }, [widget.type, widget.props.text, isHeadingEmpty, isEditable]);

  // Set up editor reference for Rich Text and Heading widgets
  useEffect(() => {
    if ((widget.type === 'richText' || widget.type === 'heading') && ref.current && editorRef) {
      if (!editorRef.current) {
        editorRef.current = ref.current.parentElement;
      }
    }
  }, [widget.type, editorRef]);

  // Function to get current cursor position
  const getCursorPosition = (element) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  // Function to set cursor position
  const setCursorPosition = (element, position) => {
    const range = document.createRange();
    const selection = window.getSelection();
    
    let charCount = 0;
    let nodeStack = [element];
    
    while (nodeStack.length > 0) {
      const node = nodeStack.pop();
      
      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharCount = charCount + node.length;
        if (position >= charCount && position <= nextCharCount) {
          range.setStart(node, position - charCount);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }
        charCount = nextCharCount;
      } else {
        for (let i = node.childNodes.length - 1; i >= 0; i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }
  };

  const handleContentChange = (e, type) => {
    if (!onContentChange || !isEditable) return;
    
    const element = e.target || e.currentTarget;
    const cursorPosition = getCursorPosition(element);
    
    let newContent;
    if (type === 'text') {
      newContent = element.textContent;
    } else {
      newContent = element.innerHTML;
    }
    
    onContentChange(widget.id, newContent);
    
    if (type === 'html') {
      requestAnimationFrame(() => {
        if (element && document.contains(element)) {
          setCursorPosition(element, cursorPosition);
          element.focus();
        }
      });
    } else {
      setTimeout(() => {
        if (element && document.contains(element)) {
          setCursorPosition(element, cursorPosition);
        }
      }, 0);
    }
  };

  const handleFocus = (e) => {
    const element = e.target;
    if (element.classList.contains('empty-placeholder')) {
      element.classList.remove('empty-placeholder');
      if (element.textContent.trim() === '') {
        element.innerHTML = '';
      }
    }
    onSelect?.(widget.id);
  };

  const handleBlur = (e) => {
    const element = e.target;
    if (element.textContent.trim() === '') {
      element.classList.add('empty-placeholder');
    }
  };

  return {
    ref,
    isModalOpen,
    setIsModalOpen,
    isEmpty,
    isHeadingEmpty,
    handleContentChange,
    handleFocus,
    handleBlur,
  };
};

export default useWidgetLogic;