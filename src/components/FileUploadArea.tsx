import { Component, createSignal } from "solid-js";
interface Props {
  description: string;
  fileName: string | undefined;
  onDropOrUpload: (fileList: FileList | undefined) => void;
}
export const FileUploadArea: Component<Props> = (props: Props) => {
  const [isDragging, setDragging] = createSignal<boolean>(false);

  let fileInputRef: HTMLInputElement | undefined;

  return (
    <div
      class={`w-full h-60 border-dashed border-2 rounded-md border-gray-500 flex justify-center bg-zinc-dark ${
        isDragging() ? "neon-inner-shadow" : ""
      }`}
      onDragEnter={(e) => {
        setDragging(true);
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragLeave={(e) => {
        setDragging(false);
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragExit={(e) => {
        setDragging(false);
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        setDragging(false);
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer?.files;
        props.onDropOrUpload(files);
      }}
    >
      <div class="self-center text-center pointer-events-none">
        <div class="text-pink-500 italic">{props.fileName}</div>
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
            const files = e?.target?.files;
            props.onDropOrUpload(files || undefined);
          }}
        ></input>
      </div>
    </div>
  );
};
