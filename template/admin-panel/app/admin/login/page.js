"use client"

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PiMicrosoftOutlookLogoLight } from "react-icons/pi";


export default function LoginPage() {
    const router = useRouter();

    const LoginSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Form Section */}
            <div className="flex-1 flex items-center justify-center p-6 ">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        Welcome Back 👋
                    </h1>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={LoginSchema}
                        onSubmit={(values, { setSubmitting, setErrors }) => {
                            setTimeout(() => {
                                if (values.password === "Welcome@123") {
                                    router.push("/");
                                } else {
                                    setErrors({ password: "Invalid password." });
                                }
                                setSubmitting(false);
                            }, 600);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                                    {isSubmitting ? "Signing in..." : "Login"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    {/* OR Divider */}
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-500 text-sm">or continue with</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    {/* Social Login Buttons */}
                    <button className="flex justify-center gap-4">
                        <div>
                            <PiMicrosoftOutlookLogoLight size={20} />
                        </div>
                        <div className="text-sm">
                            Login with Outlook
                        </div>
                    </button>

                    <p className="text-sm text-center mt-6">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-blue-600 hover:underline font-medium">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            {/* Right Image Section */}
            <div className="hidden md:flex w-1/2 h-screen flex-1 items-center justify-center">
                <img
                    src='/login.jpg'
                    alt="Login illustration"
                    className="w-3/4"
                />
            </div>
        </div>
    );
}
