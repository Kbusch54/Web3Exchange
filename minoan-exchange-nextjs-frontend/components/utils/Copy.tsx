import { useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success
interface Props {
    toCopy: string
    size?: string|number
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
  
const Copy: React.FC<Props> = ({ toCopy, size }) => {
    const [copyValue, copy] = useCopyToClipboard();

    const [clicked, setClicked] = useState(false);
    const handleOnClick = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      copy(toCopy);
      setClicked(true);
    };
    return (
        <button onClick={handleOnClick} >
            {clicked ?
            <div className="relative"> 
                <ContentCopyIcon fill="rgb(55 65 81)" className='text-gray-900' accentHeight={size?size:25} /> 
                <div className="absolute top-0 left-1 text-green-500">
                    <CheckIcon  accentHeight={size?size:25} />
                </div>
            </div> 
                : <ContentCopyIcon className='text-white' accentHeight={size?size:25} />}
        </button>
    )
}

export default Copy
