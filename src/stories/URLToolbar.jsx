import React from 'react';

const URLToolbar = ({ setUrl, insertFn, cancelFn, text }) => {
  return (
    <div>
      <input type="text" onChange={(e) => setUrl(e.target.value)} />
      <button type="button" onClick={insertFn}>
        {text}
      </button>
      <button type="button" onClick={cancelFn}>
        Cancel
      </button>
    </div>
  );
};

export default URLToolbar;
