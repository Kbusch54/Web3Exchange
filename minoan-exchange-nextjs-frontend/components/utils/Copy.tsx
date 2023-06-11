import { useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import toast from "react-hot-toast";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success
interface Props {
  toCopy: string
  size?: string | number
  children?: React.ReactNode
}
function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}

const Copy: React.FC<Props> = ({ toCopy, size, children }) => {
  const [copyValue, copy] = useCopyToClipboard();

  const [clicked, setClicked] = useState(false);
  const handleOnClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    copy(toCopy);
    toast.success('Copied to clipboard', { icon: '📋', duration: 3000 });
    setClicked(true);
  };
  return (
    <button onClick={handleOnClick} >
      {clicked ?
        <div className="flex flex-row gap-x-2 relative">
        {children}
          <ContentCopyIcon fill="rgb(55 65 81)" className='text-gray-900' accentHeight={size ? size : 25} />
          <div className="absolute top-0 right-0 text-green-500">
            <CheckIcon accentHeight={size ? size : 25} />
          </div>
        </div>
        :
        <div className="flex flex-row gap-x-2">
          {children}
          <ContentCopyIcon className='text-white' accentHeight={size ? size : 25} />
        </div>
      }
    </button>
  )
}

export default Copy
