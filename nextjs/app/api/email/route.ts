// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import { NextResponse, NextRequest } from "next/server";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const POST = async (request: NextRequest) => {
    const { email } = await request.json();

    const msg = {
        to: email,
        from: "news@regulationsnewsnetwork.online",
        subject: "Sending with SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    try {
        await sgMail.send(msg);
        return NextResponse.json({ message: "Email sent" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
