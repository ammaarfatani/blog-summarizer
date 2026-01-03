import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const saveSummary = async (
  title,
  originalText,
  summary,
  mode
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  await addDoc(collection(db, "summaries"), {
    title,
    originalText,
    summary,
    mode,
    wordCount: originalText.split(/\s+/).length,

    uid: user.uid,
    userEmail: user.email, 

    createdAt: serverTimestamp(),
  });
};
