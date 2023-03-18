import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../component/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import React from "react";

export default function TokenTopup() {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    const json = await result.json();
    console.log("result: ", json);
    window.location.href = json.session.url;
  };

  return (
    <div>
      <h1> this is the token topup</h1>
      <button className="btn" onClick={handleClick}>
        Add tokens
      </button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page} </AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    return {
      props,
    };
  },
});