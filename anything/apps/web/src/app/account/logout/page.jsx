import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ background: "linear-gradient(to bottom, #4A2D8F, #F0B429)" }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Sign Out
        </h1>
        <button
          onClick={handleSignOut}
          className="w-full rounded-lg bg-[#F0B429] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#d99f24]"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
