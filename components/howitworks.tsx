

const Howitworks = () => {
  return (
<section className="py-12 px-4 bg-white text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-12">How It Works</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {/* Step 1 */}
        <div className="bg-white p-6 w-72 rounded-lg shadow-lg">
        <div className="bg-red-500 text-white text-xl w-12 h-12 rounded-full flex justify-center items-center mb-6 font-bold mx-auto">
        1
        </div>
          <h3 className="text-xl text-gray-800 mb-4">Artists Register & List Their Work</h3>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 w-72 rounded-lg shadow-lg">
          <div className="bg-red-500 text-white text-xl w-12 h-12 rounded-full flex justify-center items-center mb-6 font-bold mx-auto">
            2
          </div>
          <h3 className="text-xl text-gray-800 mb-4">Buyers Browse & Place Orders</h3>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 w-72 rounded-lg shadow-lg">
          <div className="bg-red-500 text-white text-xl w-12 h-12 rounded-full flex justify-center items-center mb-6 font-bold mx-auto">
            3
          </div>
          <h3 className="text-xl text-gray-800 mb-4">Order Fulfillment & Secure Payments</h3>
        </div>
      </div>
    </section>
  )
}

export default Howitworks
