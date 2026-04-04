# Carson & Trotter — Prospect Notes
*Checked: 4 April 2026*

## Business Overview

**Website:** http://www.carsontrotter.co.uk/
**Address:** 123 Irish Street, Dumfries (+ offices in Castle Douglas, Moffat, Kirkcudbright)
**In business:** 95+ years
**Partners:** G K Gray BAcc CA, L E Brannock BA CA, S D Harman BA CA
**Staff:** Multiple qualified CAs + support staff
**Services:** Accounts prep, personal tax, audit, payroll, VAT, charity/club accounts, free initial consultations
**ICAS registered training office**

A well-established, 4-office firm with real revenue and a professional reputation. Strong candidate for a full rebuild.

---

## The SSL Problem

The SSL certificate installed on their server is issued for completely unrelated domains:
- conscious.co.uk / *.conscious.co.uk
- law-league.com / *.law-league.com
- lawfirmmarketingclub.co.uk / .com
- symphonylegal.com / www.symphonylegal.com

**Exact error:**
```
Hostname/IP does not match certificate's altnames:
Host: www.carsontrotter.co.uk is not in the cert's altnames
```

Any visitor going to https://www.carsontrotter.co.uk gets a browser security warning. The site uses http:// — they may not even know HTTPS is broken.

**Impact:**
- Browsers (Chrome, Safari, Firefox) show "Your connection is not private" to every visitor
- For a chartered accountants firm, this is a trust and reputation issue in real time
- Any new client Googling them and clicking through sees a security warning before reading a single word

---

## Website Assessment

The SSL issue is a symptom, not the root problem. The site itself is badly outdated:

- URL structure uses `/site/services/`, `/site/about/` — early-2000s CMS architecture
- Has an "Access Keys" accessibility page — pre-2010 web standards
- No evidence of mobile-responsive design
- Near-zero reviews: Google (minimal), Yell (unrated), Facebook (3 reviews only)
- No LinkedIn company page
- 4 offices and 3 named partners — none of this reflected online

This is a site that hasn't been properly maintained in at least 10 years. The SSL mismatch is just the most visible symptom.

---

## The Pitch

### Getting in the door — phone call script

> *"Hi, could I speak to one of the partners? My name's Akin, I run Nith Digital — I was looking at your website and noticed it's showing a security warning to visitors. The SSL certificate is registered to a completely different company, so browsers are flagging it as untrusted. Wanted to flag it before it costs you any new client enquiries."*

**Do not email first — phone call only.** A live broken site is an urgency hook that doesn't land the same way in writing.

### Moving to the rebuild conversation

Once they're grateful for the heads-up:

> *"The SSL is a quick fix, but honestly it's a symptom of a wider problem — the site is built on technology from around 2005. You've got 4 offices, 3 partners, and 95 years of reputation. Your website doesn't reflect any of that. A new site would fix the security issue permanently, show up properly on Google, and actually bring in new clients rather than losing them at the first click."*

### The framing that lands with accountants

They sell professional credibility. Their website is actively undermining it. Frame it as a cost, not a purchase:

> *"Every time a potential client Googles you and sees a security warning, that's a lost enquiry. At your average client value, one new client a year pays for this twice over."*

---

## Pricing

| Service | Price | Notes |
|---------|-------|-------|
| SSL fix | £175–300 | Emergency, one-off. Gets you in the door. |
| Business website rebuild | £500 + £40/mo | Design, build, deploy, hosting, SSL, SEO, contact form, mobile-responsive. Team profiles, 4 office location pages, service pages. |
| Ongoing support | £40/mo | Included in the above monthly. Maintenance, updates, backups, priority support. Ensures SSL never lapses again. |

**Total potential value: £675–800 upfront + £480/year recurring**

---

## Objection Handling

**"Our current provider handles the website"**
> *"That's fine — they may be able to sort the SSL, but it's been broken for a while and hasn't been fixed. Happy to just flag what the problem is so you can pass it on to them."* (Then follow up in a week when it's still broken.)

**"We don't really get clients from our website"**
> *"You might not know you're losing them — if the site shows a security warning, people leave before they even make contact. You'd never see that in your enquiry stats."*

**"We can't justify the spend right now"**
> *"Totally understand. The SSL fix is just £175–300 and I can do that this week. We can talk about the rest whenever the timing's right."*
