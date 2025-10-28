"use client";

import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadState,
  RenderUploadingState,
} from "./RenderState";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface UploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function Uploader({ onChange, value }: UploaderProps) {
  const fileUrl = useConstructUrl(value);
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    key: value || undefined,
    objectUrl: value ? fileUrl : undefined,
  });

  const uploadFile = async (file: File) => {
    setFileState((prev) => ({ ...prev, uploading: true, progress: 0 }));

    try {
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) throw new Error("Failed to get presigned");

      const { presigneUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setFileState((prev) => ({
              ...prev,
              progress: Math.round((event.loaded / event.total) * 100),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              key,
            }));
            onChange?.(key);
            toast.success("Fichier téléchargé avec succès");
            resolve();
          } else reject(new Error("Téléchargement échoué"));
        };

        xhr.onerror = () => reject(new Error("Téléchargement échoué"));

        xhr.open("PUT", presigneUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Quelques choses se sont mal passées");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  };

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.key) return;

    try {
      setFileState((prev) => ({ ...prev, isDeleting: true }));
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!response.ok) {
        toast.error("Échec lors de la suppression");
        setFileState((prev) => ({ ...prev, error: true, isDeleting: false }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        fileType: "image",
        error: false,
        id: null,
        isDeleting: false,
        key: undefined,
      });
      onChange?.("");
      toast.success("Fichier supprimé avec succès");
    } catch (error) {
      toast.error("Échec de suppression, veuillez réessayer");
      setFileState((prev) => ({ ...prev, isDeleting: false, error: true }));
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuidv4(),
        isDeleting: false,
        fileType: "image",
        key: undefined,
      });

      uploadFile(file);
    },
    [fileState.objectUrl]
  );

  const rejectedFiles = (fileRejections: FileRejection[]) => {
    if (!fileRejections.length) return;

    fileRejections.forEach((rejection) => {
      rejection.errors.forEach((error) => {
        if (error.code === "file-too-large")
          toast.error("Le fichier est trop volumineux");
        if (error.code === "too-many-files")
          toast.error("Trop de fichiers sélectionnés, maximum 1");
      });
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  const renderContent = () => {
    if (fileState.uploading)
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file!}
        />
      );
    if (fileState.error) return <RenderErrorState />;
    if (fileState.objectUrl && fileState.key !== undefined)
      return (
        <RenderUploadState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );
    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
