import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ObjectId } from "mongodb";
import { AppLayout } from "../../component/AppLayout";
import { getAppProps } from "../../utils/getAppProps";
import clientPromise from "../../lib/mongodb";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import PostsContext from "../../context/postsContext";

export default function Post(props) {
  console.log("props: ", props);

  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePost } = useContext(PostsContext);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch("/api/deletePost", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: props.id }),
      });
      const json = await response.json();
      if (json.success) {
        deletePost(props.id);
        router.replace("/post/new");
      }
    } catch (e) {}
  };

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-slate-300 rounded-sm">
          SEO Title and meta description
        </div>
        <div className="p-4 my-2 border border-slate-300 rounded-sm">
          <div className="text-cyan-700 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-slate-300 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(",").map((keyword, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-slate-300 rounded-sm">
          Blog post
        </div>
        <div dangerouslySetInnerHTML={{ __html: props.postContent || "" }} />
        <div className="my-4">
          {!showDeleteConfirm && (
            <button
              className="btn bg-red-600 hover:bg-red-800"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Post
            </button>
          )}
          {!!showDeleteConfirm && (
            <div>
              <p className="p-2 bg-red-300 text-center">
                Are you sure you want to delete this post ?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn bg-slate-400 hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn bg-red-600 hover:bg-red-800"
                >
                  Confirm delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page} </AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    const userSession = await getSession(context.req, context.res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(context.params.postId),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }
    return {
      props: {
        id: context.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        ...props,
      },
    };
  },
});