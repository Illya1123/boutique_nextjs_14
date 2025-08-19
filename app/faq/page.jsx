'use client'
import { useState, useRef } from 'react'

const faqData = [
  {
    question: "Tôi có thể đổi/trả không?",
    answer: "Bạn có thể đổi/trả trước 7 ngày và nhận hoàn tiền 100% nếu sản phẩm lỗi.",
  },
  {
    question: "Làm thế nào để đổi/trả sản phẩm?",
    answer: "Bạn có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng bằng cách liên hệ qua Zalo/SĐT trực tiếp để hoàn thành thủ tục đổi trả online hoặc ra cửa hàng trực tiếp.",
  },
  {
    question: "Địa chỉ cửa hàng ở đâu?",
    answer: "Cửa hàng có địa chỉ là Khu phố 3, thị trấn Thạnh Hoá, huyện Thạnh Hoá, tỉnh Long An.",
  },
  {
    question: "Có thể thanh toán bằng thẻ quốc tế không?",
    answer: "Có, chúng tôi chấp nhận Visa, Mastercard và Paypal. Ngoài ra còn có các kiểu thanh toán khác như ví điện tử Momo, ZaloPay hay thanh toán tiền mặt hoặc shipcod.",
  },
  {
    question: "Bao lâu tôi nhận được hàng sau khi đặt?",
    answer: "Thời gian giao hàng thông thường là từ 2-5 ngày làm việc, tùy theo khu vực.",
  },
  {
    question: "Có hỗ trợ giao hàng nhanh không?",
    answer: "Có, bạn có thể chọn dịch vụ giao hàng nhanh với phí phát sinh. Liên hệ nhân viên để được tư vấn chi tiết.",
  },
  {
    question: "Sản phẩm có bảo hành không?",
    answer: "Tất cả sản phẩm đều có bảo hành 12 tháng theo chính sách của nhà sản xuất và cửa hàng.",
  },
  {
    question: "Tôi muốn hủy đơn hàng đã đặt thì sao?",
    answer: "Bạn có thể hủy đơn hàng trước khi nhân viên vận chuyển xác nhận giao hàng. Liên hệ trực tiếp cửa hàng để được hủy đơn nhanh chóng.",
  },
  {
    question: "Có giảm giá hay voucher khi mua hàng không?",
    answer: "Có, chúng tôi thường xuyên có các chương trình khuyến mãi và voucher giảm giá. Kiểm tra mục 'Khuyến mãi' trên website hoặc liên hệ cửa hàng.",
  },
  {
    question: "Làm thế nào để liên hệ hỗ trợ khách hàng?",
    answer: "Bạn có thể liên hệ qua Zalo, số điện thoại trực tiếp, hoặc gửi email cho bộ phận chăm sóc khách hàng để được hỗ trợ nhanh chóng.",
  },
]


function Faq() {
  const [activeIndex, setActiveIndex] = useState(null)
  const contentRefs = useRef([])

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Câu hỏi thường gặp
        </h1>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => toggleIndex(index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
              >
                {/* Câu hỏi */}
                <span className="text-lg font-medium text-blue-700">{item.question}</span>
                <span className="text-2xl text-blue-500">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </button>

              <div
                ref={(el) => (contentRefs.current[index] = el)}
                style={{
                  height:
                    activeIndex === index
                      ? contentRefs.current[index]?.scrollHeight + "px"
                      : "0px",
                }}
                className="px-6 overflow-hidden transition-[height] duration-300 ease-in-out"
              >
                {/* Câu trả lời */}
                <p className="pb-4 text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Faq
