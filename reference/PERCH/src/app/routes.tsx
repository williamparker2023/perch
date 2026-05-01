import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Feed } from "./pages/Feed";
import { Explore } from "./pages/Explore";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { Saved } from "./pages/Saved";
import { CreateSelection } from "./pages/CreateSelection";
import { NewPost } from "./pages/NewPost";
import { NewBoard } from "./pages/NewBoard";
import { CollectionDetail } from "./pages/CollectionDetail";
import { Inspo } from "./pages/Inspo";
import { InspoDetail } from "./pages/InspoDetail";
import { NewInspo } from "./pages/NewInspo";
import { SelectBoardForPost } from "./pages/SelectBoardForPost";
import { PostDetail } from "./pages/PostDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Feed },
      { path: "explore", Component: Explore },
      { path: "profile", Component: Profile },
      { path: "profile/edit", Component: EditProfile },
      { path: "profile/:id", Component: Profile }, // Basic profile view re-use
      { path: "saved", Component: Saved },
      { path: "collection/:id", Component: CollectionDetail },
      { path: "create", element: <Navigate to="/" replace /> },
      { path: "post/select-board", Component: SelectBoardForPost },
      { path: "post/new", Component: NewPost },
      { path: "post/:id", Component: PostDetail },
      { path: "board/new", Component: NewBoard },
      { path: "inspo", Component: Inspo },
      { path: "inspo/new", Component: NewInspo },
      { path: "inspo/:id", Component: InspoDetail },
    ],
  },
]);
