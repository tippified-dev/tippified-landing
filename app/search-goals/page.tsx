import NavBar from "../components/NavBar";
export default function SearchGoals() {
   
  return (
    <>
    <NavBar/>
    <main className="bg-white text-gray-900 min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Search Goals</h1>
      <p className="text-gray-700 mb-4">
        At Tippified, we respect your privacy and are committed to protecting your personal data...
      </p>
      <p className="text-gray-700 mb-4">
        {/* Add detailed privacy policy content here */}
        Your data is used solely to provide our platform services. We do not share your information with third parties without your consent.
      </p>
      <p className="text-gray-700 mb-4">
        For more information or inquiries, please contact us via the Contact Us page.
      </p>

      
    </main>
    </>
  );
}