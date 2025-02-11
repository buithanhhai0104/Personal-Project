// import React, { useState } from "react";
// import { EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // Đảm bảo thêm file CSS của thư viện

// const CreateNews = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     created_at: "",
//     image: "",
//   });

//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleEditorChange = (state) => {
//     setEditorState(state);
//     const content = state.getCurrentContent().getPlainText();
//     setFormData({ ...formData, content });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form data submitted:", formData);
//     // Thực hiện xử lý gửi form tại đây
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
//       <h1 className="text-2xl font-semibold text-gray-700 mb-6">
//         Tạo bài báo mới
//       </h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Tiêu đề */}
//         <div>
//           <label
//             htmlFor="title"
//             className="block text-gray-600 font-medium mb-2"
//           >
//             Tiêu đề
//           </label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Nhập tiêu đề bài báo"
//           />
//         </div>

//         {/* Nội dung */}
//         <div>
//           <label
//             htmlFor="content"
//             className="block text-gray-600 font-medium mb-2"
//           >
//             Nội dung
//           </label>
//           <div className="border rounded-md p-4 text-black">
//             <Editor
//               editorState={editorState}
//               onEditorStateChange={handleEditorChange}
//               toolbarClassName="toolbarClassName"
//               wrapperClassName="wrapperClassName"
//               editorClassName="editorClassName"
//               placeholder="Nhập nội dung bài báo"
//             />
//           </div>
//         </div>

//         {/* Ngày tạo */}
//         <div>
//           <label
//             htmlFor="created_at"
//             className="block text-gray-600 font-medium mb-2"
//           >
//             Ngày tạo
//           </label>
//           <input
//             type="date"
//             id="created_at"
//             name="created_at"
//             value={formData.created_at}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Ảnh */}
//         <div>
//           <label
//             htmlFor="image"
//             className="block text-gray-600 font-medium mb-2"
//           >
//             URL Ảnh
//           </label>
//           <input
//             type="text"
//             id="image"
//             name="image"
//             value={formData.image}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Nhập URL ảnh"
//           />
//         </div>

//         {/* Nút gửi */}
//         <div className="text-right">
//           <button
//             type="submit"
//             className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             Tạo bài báo
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateNews;
