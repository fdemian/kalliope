import type { SetStateAction, Dispatch, MouseEventHandler } from 'react';

type URLToolbarTypes = {
  setUrl: Dispatch<SetStateAction<string | null>>;
  insertFn: MouseEventHandler<HTMLButtonElement> | undefined;
  cancelFn: MouseEventHandler<HTMLButtonElement> | undefined;
  text: string;
};

const URLToolbar = ({ setUrl, insertFn, cancelFn, text }: URLToolbarTypes) => {
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
