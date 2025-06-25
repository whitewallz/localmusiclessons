import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from './firebase'

export async function sendMessage({
  teacherId,
  teacherName,
  studentName,
  studentEmail,
  message,
}: {
  teacherId: string
  teacherName: string
  studentName: string
  studentEmail: string
  message: string
}) {
  return await addDoc(collection(db, 'messages'), {
    teacherId,
    teacherName,
    studentName,
    studentEmail,
    message,
    createdAt: serverTimestamp(),
  })
}

export async function getMessagesForTeacher(teacherId: string) {
  const q = query(collection(db, 'messages'), where('teacherId', '==', teacherId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
