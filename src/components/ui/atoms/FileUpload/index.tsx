import { ReactNode, useCallback, useRef } from "react";
import { Button } from "@chakra-ui/react";

interface FileUploadProps {
  placeholder?: string; 
  acceptedFileTypes?: string[];
  maxSize?: number;
  onChange?(dataURL: string | ArrayBuffer | null): void;
  children?: ReactNode
}

const FileUpload = ({ placeholder, acceptedFileTypes = [], maxSize, onChange, children}: FileUploadProps) => {

  const inputRef = useRef<any>()

  const verifyFile = (files: File[]) => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (maxSize && (currentFileSize > maxSize)) {
        alert(
          'Arquivo muito grande: ' + currentFileSize + ' bytes',
        );
        return false;
      }
      return true;
    }
  };

  const onSelectFile = useCallback((e: any) => {
    const files = e.target.files;
    const isVerified = verifyFile(files);
    if (isVerified) {
      const currentFile = files[0];
      const fileItemReader = new FileReader();
      fileItemReader.addEventListener(
        'load',
        () => {
          onChange && onChange(fileItemReader.result)
        },
        false,
      );
      fileItemReader.readAsDataURL(currentFile);
    }
  }, [onChange]);

  return (
    <>
    <input
        style={{display: 'none'}}
        id="raised-button-file"
        type="file"
        onChange={onSelectFile}
        multiple={false}
        accept={acceptedFileTypes.join(',')}
        onClick={(event: any) => {
          event.target.value = null;
        }}
        ref={inputRef}
      />

      <label htmlFor="raised-button-file">
        <Button onClick={() => inputRef.current.click()}>
          {placeholder || "Selecionar arquivo"}
        </Button>
      </label>
    </>
  );
}

export default FileUpload;