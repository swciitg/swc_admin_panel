"use client"

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebookF } from "react-icons/fa";
import LoginImg from '../../public/login.jpg'

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
                    <div className="flex justify-center gap-4">
                        <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200">
                            <FcGoogle size={22} />
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200">
                            <FaGithub size={20} />
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200">
                            <FaFacebookF size={20} className="text-blue-600" />
                        </button>
                    </div>

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
                    src={LoginImg}
                    alt="Login illustration"
                    className="w-3/4"
                />
            </div>
        </div>
    );
}
