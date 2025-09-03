import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import React from "react";

const SignUpSuccess = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Thank you for signing Up</CardTitle>
              <CardDescription>Your account has been created successfully!</CardDescription>
            </CardHeader>
            <CardContent>
              <CardDescription>Please check your email to confirm your account, after that you can use your account and login to the site.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;
