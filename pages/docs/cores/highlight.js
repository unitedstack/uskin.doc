const highlight = () => {
  const blocks = document.querySelectorAll('pre code');
  Array.from(blocks).forEach((block) => {
    hljs.highlightBlock(block);
  });
};

export default highlight;
