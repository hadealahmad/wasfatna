export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose dark:prose-invert">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, submit receipts, or communicate with us. This may include your name, email address, and profile information.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, including to:
                    </p>
                    <ul className="list-disc ml-6 mt-2">
                        <li>Process your registration and maintain your account</li>
                        <li>Display your recipes and profile to other users</li>
                        <li>Send you technical notices and support messages</li>
                        <li>Analyze trends and usage of our platform</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">3. Information Sharing</h2>
                    <p>
                        We do not share your personal information with third parties except as described in this policy or with your consent. Publicly shared recipes and profile information are visible to other users.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">4. Security</h2>
                    <p>
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>
                </section>
            </div>
        </div>
    );
}
