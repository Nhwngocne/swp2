// src/components/common/MyCKEditor.jsx
import React, { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const MyCKEditor = ({ value, onChange }) => {
  const editorRef = useRef();
  const token = localStorage.getItem("token"); // Lấy token nếu có dùng xác thực

  // Custom upload adapter cho CKEditor (dùng với backend Spring Boot)
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    async upload() {
      const file = await this.loader.file;
      const formData = new FormData();
      formData.append("upload", file); // "upload" khớp với @RequestParam trong backend

      try {
        const response = await fetch("http://localhost:8080/swp391/blogs/upload-image", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Nếu BE yêu cầu xác thực
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        const result = await response.json();
        return {
          default: result.url, // CKEditor expects { default: "imageURL" }
        };
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      }
    }

    abort() {
      // Optional: Xử lý khi người dùng hủy upload ảnh
    }
  }

  // Plugin để gán upload adapter vào CKEditor
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        extraPlugins: [CustomUploadAdapterPlugin],
        placeholder: "Nhập nội dung bài viết...",
      }}
      onReady={(editor) => {
        editorRef.current = editor;
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default MyCKEditor;
