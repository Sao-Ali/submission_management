# 🖥️ Web-Based File Processing System

## 📌 Overview
This project is a **web-based interface** for uploading structured data files, processing them with a Unix-based computation pipeline, and retrieving meaningful results. It integrates **Node.js, Express.js, Bash scripting, and a compiled C program (`checksum`)** to enable users to analyze files without needing direct terminal access.

### **🚀 Key Features**
✔ **User-friendly file upload system** 📂  
✔ **Automated execution of Unix-based scripts** ⚙️  
✔ **Checksum verification for data integrity** 🔍  
✔ **Real-time file analysis (edges, nodes, md5sum)** 📊  
✔ **Integration of a C program (`checksum`) into a web service** 💻  

---

## **🛠️ How It Works**
1. **User Uploads a File**  
   - The web interface allows users to upload a **structured dataset** (e.g., an edge list).
   - The uploaded file is stored **temporarily** in `/tmp/` on the server.

2. **Server Processes the File**  
   - The backend (Node.js + Express.js) **validates and saves the file**.
   - The server **executes `backend.sh`**, a Unix shell script that:
     - Runs the **compiled C program (`checksum`)**.
     - **Computes checksum values** to verify data integrity.
     - **Counts nodes and edges** in the dataset.
     - Returns a **formatted output**.

3. **Results Are Displayed on the Web Page**  
   - The backend captures the results and sends them to the frontend.
   - The user **sees the output dynamically** on the website.

---

## **⚙️ Technologies Used**
| **Component** | **Technology** |
|--------------|--------------|
| **Frontend** | HTML, JavaScript |
| **Backend**  | Node.js, Express.js |
| **File Handling** | Multer (for file uploads) |
| **Computation** | C (checksum binary), Bash (backend processing) |
| **Deployment** | Vercel (hosted backend) |

---

## **🖥️ Setup Instructions**

### **🔹 Prerequisites**
- **Node.js** (v18 or later)
- **GCC** (for compiling `checksum.c`)
- **Git** (for version control)
- **Vercel CLI** (for deployment)

### **🔹 Installation**
1. **Clone the Repository**
   ```bash
   git clone git@github.com:Sao-Ali/submission_management.git
   cd submission_management
