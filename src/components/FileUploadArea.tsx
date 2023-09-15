import { Component } from "solid-js";
interface Props {
  description: string;
  isDragging: boolean;
  fileName: string | undefined;
  setDragging: (dragging: boolean) => void;
  onDropOrUpload: (fileList: FileList | undefined) => void;
}
export const FileUploadArea: Component<Props> = (props: Props) => {
  let fileInputRef: HTMLInputElement | undefined;

  return (
    <div
      class={`w-full h-60 border-dashed border-2 rounded-md border-gray-500 flex justify-center bg-zinc-dark ${
        props.isDragging ? "neon-inner-shadow" : ""
      }`}
      onDragEnter={(e) => {
        props.setDragging(true);
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragLeave={(e) => {
        props.setDragging(false);
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragExit={(e) => {
        props.setDragging(false);
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        props.setDragging(false);
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer?.files;
        props.onDropOrUpload(files);
      }}
    >
      <div class="self-center text-center pointer-events-none">
        <div class="text-teal-300 italic">{props.fileName}</div>
        <div>{props.description}</div>
        <button
          class="btn mt-3 bg-zinc-600 pointer-events-auto hover:bg-zinc-500"
          onClick={() => {
            fileInputRef!.click();
          }}
        >
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          class="hidden"
          onChange={(e) => {
            console.log(e);
            const files = e?.target?.files;
            props.onDropOrUpload(files || undefined);
          }}
        ></input>
      </div>
    </div>
  );
};
