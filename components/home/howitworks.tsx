const Howitworks = () => {
  return (
    <section className="py-2 px-5 bg-gray-50 text-center h-full flex flex-col justify-center">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">How It Works</h2>

      {/* Steps Wrapper */}
      <div className="flex flex-col items-center gap-6">
        {/* Step 1 */}
        <div className="bg-white p-5 w-80 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="bg-red-500 text-white text-xl w-12 h-12 rounded-full flex justify-center items-center font-bold mx-auto">
            1
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">
            Artists Register & List Their Work
          </h3>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-5 w-80 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="bg-red-500 text-white text-xl w-12 h-12 rounded-full flex justify-center items-center font-bold mx-auto">
            2
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">
            Buyers Browse & Place Orders
          </h3>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-5 w-80 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="bg-red-500 text-white text-xl w-12 h-12 rounded-full flex justify-center items-center font-bold mx-auto">
            3
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">
            Order Fulfillment & Secure Payments
          </h3>
        </div>
      </div>
    </section>
  );
};

export default Howitworks;
