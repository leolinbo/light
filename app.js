import 'dotenv/config';
import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

for (const k of ['OPENAI_API_KEY','SMTP_USER','SMTP_PASS']) {
  if (!process.env[k]) { console.error('Missing '+k+' in .env'); process.exit(1); }
}
const rl = readline.createInterface({input,output});
const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const task = await rl.question('\nTask (example: find 10 lighting distributors in Bangkok):\n> ');

console.log('\nResearching prospects and drafting emails...\n');
const r = await client.responses.create({
  model:'gpt-5',
  tools:[{type:'web_search_preview'}],
  input:`You are ENCORE, a Shenzhen direct LED lighting manufacturer.
Official site: https://www.encore-tech.com/
Products: high-end track lights, downlights and commercial lighting solutions.
Find qualified B2B prospects such as lighting distributors, suppliers, contractors and project companies.
Task: ${task}
Return company, website, city/country, business type, why relevant, public business email if clearly available, and a short personalized English outreach email. Never invent email addresses.`
});
console.log(r.output_text);

const ok = await rl.question('\nSend an email? Type YES to continue: ');
if (ok.trim().toUpperCase() !== 'YES') { console.log('Cancelled. Nothing sent.'); await rl.close(); process.exit(0); }

const to = await rl.question('Recipient email: ');
const subject = await rl.question('Subject: ');
const body = await rl.question('Email body: ');

const transporter = nodemailer.createTransport({
  host:process.env.SMTP_HOST || 'c2.icoremail.net',
  port:Number(process.env.SMTP_PORT || 465),
  secure:String(process.env.SMTP_SECURE || 'true').toLowerCase()==='true',
  auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
});
await transporter.verify();
const info = await transporter.sendMail({from:process.env.FROM_EMAIL || process.env.SMTP_USER,to,subject,text:body});
console.log('Sent successfully. Message ID: '+info.messageId);
await rl.close();
