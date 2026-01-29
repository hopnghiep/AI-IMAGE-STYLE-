
import type { ArtStyle, StyleFolder } from './types';

const BUCKET_URL = 'https://storage.googleapis.com/aistudio-red-team';

export const DEFAULT_FOLDERS: StyleFolder[] = [
  { id: 'fld_sketch', name: 'PHÁC THẢO', name_en: 'SKETCH' },
  { id: 'fld_watercolor', name: 'MÀU NƯỚC', name_en: 'WATER COLOR' },
  { id: 'fld_oilpainting', name: 'SƠN DẦU', name_en: 'OIL PAINTING' },
  { id: 'fld_vietnam', name: 'VIỆT NAM', name_en: 'VIET NAM' },
  { id: 'fld_danhhoa', name: 'DANH HỌA', name_en: 'MASTERS' },
  { id: 'fld_hoathinh', name: 'HOẠT HÌNH', name_en: 'ANIMATION' },
  { id: 'fld_chinese', name: 'TRUNG HOA', name_en: 'CHINESE' },
  { id: 'fld_photo', name: 'NHIẾP ẢNH', name_en: 'PHOTO' },
  { id: 'fld_khac', name: 'KHÁC', name_en: 'OTHERS' },
  { id: 'fld_3d', name: '3D', name_en: '3D' },
  { id: 'fld_dieukhac', name: 'ĐIÊU KHẮC', name_en: 'SCULPTURE' }
];

export const ART_STYLES: ArtStyle[] = [
  {
    id: '6b-pencil-crosshatch',
    label: '6B Pencil Crosshatch',
    label_vi: 'Phác thảo chì 6B',
    folderId: 'fld_sketch',
    prompt: 'A detailed and expressive sketch created with a soft 6B pencil. The shading and tonal values are built up through multiple layers of dense, multi-directional cross-hatching, creating a rich texture and a wide range of shadows and light.',
    prompt_vi: 'Một bản phác thảo chi tiết và biểu cảm được tạo bằng bút chì 6B mềm. Việc tô bóng và các giá trị tông màu được tạo nên qua nhiều lớp gạch chéo dày đặc, đa hướng, tạo ra một kết cấu phong phú và dải bóng tối và ánh sáng rộng.',
    thumbnail: `${BUCKET_URL}/thumbnails/6b-pencil-crosshatch.webp`,
    preview: `${BUCKET_URL}/previews/6b-pencil-crosshatch.webp`,
    exampleImage: `https://picsum.photos/seed/6b-pencil-crosshatch/200/100`
  },
  {
    id: 'abstract-art',
    label: 'Abstract Art',
    label_vi: 'Nghệ thuật Trừu tượng',
    folderId: 'fld_khac',
    prompt: 'A dynamic and expressive abstract artwork. Focus on a composition of bold, interlocking geometric shapes and a vibrant, high-contrast color palette to create a sense of energy and movement.',
    prompt_vi: 'Một tác phẩm nghệ thuật trừu tượng năng động và biểu cảm. Tập trung vào bố cục của các hình dạng hình học táo bạo, lồng vào nhau và bảng màu rực rỡ, tương phản cao để tạo cảm giác năng lượng và chuyển động.',
    thumbnail: `${BUCKET_URL}/thumbnails/abstract-art.webp`,
    preview: `${BUCKET_URL}/previews/abstract-art.webp`,
    exampleImage: `https://picsum.photos/seed/abstract-art/200/100`
  },
  {
    id: 'anatomical-ink-sketch',
    label: 'Anatomical Ink Sketch',
    label_vi: 'Phác thảo Giải phẫu',
    folderId: 'fld_sketch',
    prompt: 'A dynamic anatomical ink sketch, in the style of an artist\'s study. The drawing should feature expressive, confident linework that defines the form and musculature of the subject. Include visible red construction lines and geometric guides to emphasize the underlying structure and proportions, giving it a technical, analytical feel while retaining a sense of energy and movement.',
    prompt_vi: 'Một bản phác thảo mực giải phẫu năng động, theo phong cách nghiên cứu của một nghệ sĩ. Bức vẽ phải có những đường nét biểu cảm, tự tin xác định hình dạng và cơ bắp của đối tượng. Bao gồm các đường dựng màu đỏ và các hướng dẫn hình học có thể nhìn thấy để nhấn mạnh cấu trúc và tỷ lệ cơ bản, mang lại cảm giác kỹ thuật, phân tích trong khi vẫn giữ được cảm giác năng lượng và chuyển động.',
    thumbnail: `${BUCKET_URL}/thumbnails/anatomical-ink-sketch.webp`,
    preview: `${BUCKET_URL}/previews/anatomical-ink-sketch.webp`,
    exampleImage: `https://picsum.photos/seed/anatomical-ink-sketch/200/100`
  },
  {
    id: 'anime',
    label: 'Anime',
    label_vi: 'Hoạt hình Nhật Bản',
    folderId: 'fld_hoathinh',
    prompt: 'a vibrant anime style artwork with cel shading, sharp lines, and expressive characters.',
    prompt_vi: 'một tác phẩm nghệ thuật theo phong cách anime rực rỡ với tô bóng cel, các đường nét sắc sảo và các nhân vật biểu cảm.',
    thumbnail: `${BUCKET_URL}/thumbnails/anime.webp`,
    preview: `${BUCKET_URL}/previews/anime.webp`,
    exampleImage: `https://picsum.photos/seed/anime/200/100`
  },
  {
    id: 'iron-pen-sketch-blue',
    label: 'Iron Pen Sketch (Blue)',
    label_vi: 'Bút sắt Mực xanh',
    folderId: 'fld_sketch',
    prompt: 'an intricate iron pen sketch using blue ink, characterized by sharp, deliberate lines and cross-hatching for depth and shadow.',
    prompt_vi: 'một bản phác thảo bút sắt phức tạp bằng mực xanh, đặc trưng bởi các đường nét sắc sảo, có chủ ý và gạch chéo để tạo chiều sâu và bóng tối.',
    thumbnail: `${BUCKET_URL}/thumbnails/blue-ink-pen.webp`,
    preview: `${BUCKET_URL}/previews/blue-ink-pen.webp`,
    exampleImage: `https://picsum.photos/seed/iron-pen-sketch-blue/200/100`
  },
  {
    id: 'bold-pencil-crosshatch',
    label: 'Bold Pencil Crosshatch',
    label_vi: 'Chì đậm Gạch chéo',
    folderId: 'fld_sketch',
    prompt: 'A bold pencil sketch characterized by thick, expressive lines. Shading and depth are created using prominent multi-directional cross-hatching techniques, giving the artwork a textured and dynamic feel.',
    prompt_vi: 'Một bản phác thảo chì táo bạo đặc trưng bởi các đường nét dày, biểu cảm. Bóng và chiều sâu được tạo ra bằng cách sử dụng các kỹ thuật gạch chéo đa hướng nổi bật, mang lại cho tác phẩm nghệ thuật một cảm giác có kết cấu và năng động.',
    thumbnail: `${BUCKET_URL}/thumbnails/bold-pencil-crosshatch.webp`,
    preview: `${BUCKET_URL}/previews/bold-pencil-crosshatch.webp`,
    exampleImage: `https://picsum.photos/seed/bold-pencil-crosshatch/200/100`
  },
  {
    id: 'bold-pencil-sketch',
    label: 'Bold Pencil Sketch',
    label_vi: 'Phác thảo Chì đậm',
    folderId: 'fld_sketch',
    prompt: 'a detailed pencil sketch with thick, bold, and expressive lines and heavy shading, creating a dramatic and high-contrast look.',
    prompt_vi: 'một bản phác thảo chì chi tiết với các đường nét dày, đậm và biểu cảm cùng với việc tô bóng đậm, tạo ra một giao diện đầy kịch tính và có độ tương phản cao.',
    thumbnail: `${BUCKET_URL}/thumbnails/bold-pencil-sketch.webp`,
    preview: `${BUCKET_URL}/previews/bold-pencil-sketch.webp`,
    exampleImage: `https://picsum.photos/seed/bold-pencil-sketch/200/100`
  },
  {
    id: 'caricature',
    label: 'Caricature',
    label_vi: 'Biếm họa',
    folderId: 'fld_khac',
    prompt: 'a caricature drawing with exaggerated features.',
    prompt_vi: 'một bức tranh biếm họa với các đặc điểm được phóng đại.',
    thumbnail: `${BUCKET_URL}/thumbnails/caricature.webp`,
    preview: `${BUCKET_URL}/previews/caricature.webp`,
    exampleImage: `https://picsum.photos/seed/caricature/200/100`
  },
  {
    id: 'charcoal-sketch',
    label: 'Charcoal Sketch',
    label_vi: 'Phác thảo Than củi',
    folderId: 'fld_sketch',
    prompt: 'a charcoal sketch with a smudged, grainy texture and a wide tonal range, capturing both deep blacks and subtle grays.',
    prompt_vi: 'một bản phác thảo than củi với kết cấu nhòe, sần sùi và dải tông màu rộng, ghi lại cả màu đen sâu và màu xám tinh tế.',
    thumbnail: `${BUCKET_URL}/thumbnails/charcoal-sketch.webp`,
    preview: `${BUCKET_URL}/previews/charcoal-sketch.webp`,
    exampleImage: `https://picsum.photos/seed/charcoal-sketch/200/100`
  },
  {
    id: 'chinese-ink-wash',
    label: 'Chinese Ink Wash',
    label_vi: 'Thủy mặc Trung Hoa',
    folderId: 'fld_chinese',
    prompt: 'A traditional Chinese ink wash painting (Shanshui hua). The style should feature expressive, calligraphic brushstrokes, a focus on mountainous landscapes, water elements, and atmospheric perspective. Use varying ink tones to create depth and mood, with an emphasis on minimalism, balance, and the beauty of nature.',
    prompt_vi: 'Một bức tranh thủy mặc truyền thống của Trung Quốc (Sơn thủy họa). Phong cách cần có những nét cọ thư pháp biểu cảm, tập trung vào phong cảnh núi non, các yếu tố nước và phối cảnh không khí. Sử dụng các tông màu mực khác nhau để tạo chiều sâu và tâm trạng, với sự nhấn mạnh vào sự tối giản, cân bằng và vẻ đẹp của thiên nhiên.',
    thumbnail: `${BUCKET_URL}/thumbnails/chinese-ink-wash.webp`,
    preview: `${BUCKET_URL}/previews/chinese-ink-wash.webp`,
    exampleImage: `https://picsum.photos/seed/chinese-ink-wash/200/100`
  },
  {
    id: 'colorful-brushwork',
    label: 'Colorful Brushwork',
    label_vi: 'Nét cọ Đa sắc',
    folderId: 'fld_oilpainting',
    prompt: 'A painting with a textured, painterly feel, characterized by visible, blocky, and expressive brushstrokes. The style uses a vibrant and rich color palette to create depth and raw texture.',
    prompt_vi: 'Một bức tranh có cảm giác họa sĩ, kết cấu, đặc trưng bởi các nét cọ có thể nhìn thấy, khối và biểu cảm. Phong cách sử dụng bảng màu rực rỡ và phong phú để tạo chiều sâu và kết cấu thô.',
    thumbnail: `${BUCKET_URL}/thumbnails/colorful-brushwork.webp`,
    preview: `${BUCKET_URL}/previews/colorful-brushwork.webp`,
    exampleImage: `https://picsum.photos/seed/colorful-brushwork/200/100`
  },
  {
    id: 'continuous-line-portrait',
    label: 'Continuous Line Portrait',
    label_vi: 'Chân dung Nét liền',
    folderId: 'fld_sketch',
    prompt: 'A minimalist continuous line portrait, where the subject is rendered using a single, unbroken, and fluid line. The style focuses on capturing the essential features and form with elegance and simplicity.',
    prompt_vi: 'Một bức chân dung đường nét liên tục tối giản, trong đó đối tượng được thể hiện bằng một đường duy nhất, không đứt đoạn và uyển chuyển. Phong cách tập trung vào việc nắm bắt các đặc điểm và hình thức thiết yếu với sự thanh lịch và đơn giản.',
    thumbnail: `${BUCKET_URL}/thumbnails/continuous-line-portrait.webp`,
    preview: `${BUCKET_URL}/previews/continuous-line-portrait.webp`,
    exampleImage: `https://picsum.photos/seed/continuous-line-portrait/200/100`
  },
  {
    id: 'crystal-object',
    label: 'Crystal Object',
    label_vi: 'Vật thể Pha lê',
    folderId: 'fld_3d',
    prompt: 'Transform the subject into a delicate and intricate sculpture made of shimmering, transparent crystal. The style should capture the play of light, with clear reflections and refractions, giving it an ethereal and magical quality.',
    prompt_vi: 'Biến đổi chủ thể thành một tác phẩm điêu khắc tinh xảo và tinh tế làm từ pha lê trong suốt, lung linh. Phong cách này phải nắm bắt được sự chơi đùa của ánh sáng, với các phản xạ và khúc xạ rõ ràng, mang lại cho nó một chất lượng thanh tao và huyền diệu.',
    thumbnail: `${BUCKET_URL}/thumbnails/crystal-object.webp`,
    preview: `${BUCKET_URL}/previews/crystal-object.webp`,
    exampleImage: `https://picsum.photos/seed/crystal-object/200/100`
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    label_vi: 'Cyberpunk',
    folderId: 'fld_photo',
    prompt: 'a futuristic cyberpunk cityscape with neon lights, high-tech elements, and a gritty atmosphere.',
    prompt_vi: 'một cảnh quan thành phố cyberpunk tương lai với đèn neon, các yếu tố công nghệ cao và một bầu không khí gai góc.',
    thumbnail: `${BUCKET_URL}/thumbnails/cyberpunk.webp`,
    preview: `${BUCKET_URL}/previews/cyberpunk.webp`,
    exampleImage: `https://picsum.photos/seed/cyberpunk/200/100`
  },
  {
    id: 'detailed-bronze-sculpture',
    label: 'Detailed Bronze Sculpture',
    label_vi: 'Điêu khắc Đồng chi tiết',
    folderId: 'fld_dieukhac',
    prompt: 'Transform the subject into a hyper-realistic and intricately detailed bronze sculpture. The style should capture the fine textures of aged metal, the dramatic interplay of light and shadow across the form, and the realistic definition of musculature and drapery. The final image should have the weight and gravitas of a classical masterpiece.',
    prompt_vi: 'Biến đổi chủ thể thành một tác phẩm điêu khắc bằng đồng siêu thực và chi tiết tinh xảo. Phong cách này phải nắm bắt được kết cấu tinh xảo của kim loại lâu năm, sự tương tác đầy kịch tính của ánh sáng và bóng tối trên hình dạng, và sự xác định thực tế của cơ bắp và nếp vải. Hình ảnh cuối cùng phải có sức nặng và sự trang trọng của một kiệt tác cổ điển.',
    thumbnail: `${BUCKET_URL}/thumbnails/detailed-bronze-sculpture.webp`,
    preview: `${BUCKET_URL}/previews/detailed-bronze-sculpture.webp`,
    exampleImage: `https://picsum.photos/seed/detailed-bronze-sculpture/200/100`
  },
  {
    id: 'dynamic-watercolor-sketch',
    label: 'Dynamic Watercolor Sketch',
    label_vi: 'Phác thảo Màu nước Năng động',
    folderId: 'fld_watercolor',
    prompt: 'An energetic and dynamic watercolor sketch, featuring loose, expressive ink linework combined with vibrant, playful watercolor splashes. The style should convey a sense of joy and movement, with a clean, modern feel, emphasizing expressive characters and a slightly exaggerated, illustrative quality.',
    prompt_vi: 'Một bản phác thảo màu nước tràn đầy năng lượng và năng động, có các đường mực lỏng lẻo, biểu cảm kết hợp với các mảng màu nước rực rỡ, vui tươi. Phong cách phải truyền tải cảm giác vui vẻ và chuyển động, với cảm giác sạch sẽ, hiện đại, nhấn mạnh các nhân vật biểu cảm và chất lượng minh họa hơi phóng đại.',
    thumbnail: `${BUCKET_URL}/thumbnails/dynamic-watercolor-sketch.webp`,
    preview: `${BUCKET_URL}/previews/dynamic-watercolor-sketch.webp`,
    exampleImage: `https://picsum.photos/seed/dynamic-watercolor-sketch/200/100`
  },
  {
    id: 'ethereal-watercolor',
    label: 'Ethereal Watercolor',
    label_vi: 'Màu nước Thanh tao',
    folderId: 'fld_watercolor',
    prompt: 'An ethereal watercolor portrait. The style should feature soft, blended washes of color creating a luminous, almost dreamlike quality. Emphasize a delicate interplay of light and shadow, retaining a sense of realism while embracing the fluid and expressive nature of the watercolor medium.',
    prompt_vi: 'Một bức chân dung màu nước thanh tao. Phong cách nên có các mảng màu mềm mại, hòa quyện tạo ra chất lượng sáng, gần như mơ mộng. Nhấn mạnh sự tương tác tinh tế của ánh sáng và bóng tối, giữ lại cảm giác chân thực trong khi nắm bắt bản chất lỏng và biểu cảm của phương tiện màu nước.',
    thumbnail: `${BUCKET_URL}/thumbnails/ethereal-watercolor.webp`,
    preview: `${BUCKET_URL}/previews/ethereal-watercolor.webp`,
    exampleImage: `https://picsum.photos/seed/ethereal-watercolor/200/100`
  },
  {
    id: 'expressive-watercolor-portrait',
    label: 'Expressive Watercolor Portrait',
    label_vi: 'Chân dung Màu nước Biểu cảm',
    folderId: 'fld_watercolor',
    prompt: 'An expressive and detailed watercolor portrait. Focus on capturing deep character and emotion. Use a realistic yet painterly approach, with visible brushstrokes and a rich, textured application of paint. Emphasize the interplay of light and shadow to create depth and volume. The color palette should be earthy and natural, with nuanced skin tones.',
    prompt_vi: 'Một bức chân dung màu nước biểu cảm và chi tiết. Tập trung vào việc nắm bắt tính cách và cảm xúc sâu sắc. Sử dụng phương pháp tiếp cận thực tế nhưng mang tính hội họa, với các nét cọ có thể nhìn thấy và ứng dụng sơn phong phú, có kết cấu. Nhấn mạnh sự tương tác của ánh sáng và bóng tối để tạo chiều sâu và khối lượng. Bảng màu nên là màu đất và tự nhiên, với tông màu da đa sắc thái.',
    thumbnail: `${BUCKET_URL}/thumbnails/expressive-watercolor-portrait.webp`,
    preview: `${BUCKET_URL}/previews/expressive-watercolor-portrait.webp`,
    exampleImage: `https://picsum.photos/seed/expressive-watercolor-portrait/200/100`
  },
  {
    id: 'fashion-watercolor-sketch',
    label: 'Fashion Watercolor Sketch',
    label_vi: 'Minh họa Thời trang Màu nước',
    folderId: 'fld_watercolor',
    prompt: 'A fashion illustration sketch combining clean, defined lines for the subject with loose, expressive watercolor splashes and drips in the background. The style should be elegant and modern, with a focus on form and a minimalist yet vibrant color palette.',
    prompt_vi: 'Một bản phác thảo minh họa thời trang kết hợp các đường nét sạch sẽ, rõ ràng cho chủ thể với các mảng màu nước và giọt màu lỏng lẻo, biểu cảm ở hậu cảnh. Phong cách phải thanh lịch và hiện đại, tập trung vào hình thức và bảng màu tối giản nhưng rực rỡ.',
    thumbnail: `${BUCKET_URL}/thumbnails/fashion-watercolor-sketch.webp`,
    preview: `${BUCKET_URL}/previews/fashion-watercolor-sketch.webp`,
    exampleImage: `https://picsum.photos/seed/fashion-watercolor-sketch/200/100`
  },
  {
    id: 'gouache-painting',
    label: 'Gouache Painting',
    label_vi: 'Tranh màu Bột (Gouache)',
    folderId: 'fld_watercolor',
    prompt: 'A vibrant and detailed painting in the style of gouache. The artwork should have an opaque, matte finish with distinct, solid layers of color and fine details. The colors should be rich and saturated, capturing the characteristic chalky yet bold look of gouache.',
    prompt_vi: 'Một bức tranh rực rỡ và chi tiết theo phong cách gouache. Tác phẩm nghệ thuật phải có bề mặt mờ, đục với các lớp màu đặc, riêng biệt và các chi tiết tinh xảo. Màu sắc phải đậm và bão hòa, nắm bắt được vẻ ngoài đặc trưng của gouache vừa có chất phấn vừa táo bạo.',
    thumbnail: `${BUCKET_URL}/thumbnails/gouache-painting.webp`,
    preview: `${BUCKET_URL}/previews/gouache-painting.webp`,
    exampleImage: `https://picsum.photos/seed/gouache-painting/200/100`
  },
  {
    id: 'impressionism',
    label: 'Impressionism',
    label_vi: 'Trường phái Ấn tượng',
    folderId: 'fld_danhhoa',
    prompt: 'an impressionist painting with visible, short brushstrokes, an emphasis on the accurate depiction of light and its changing qualities, and a vibrant color palette.',
    prompt_vi: 'một bức tranh theo trường phái ấn tượng với các nét cọ ngắn, có thể nhìn thấy, nhấn mạnh vào việc mô tả chính xác ánh sáng và các phẩm chất thay đổi của nó, và một bảng màu rực rỡ.',
    thumbnail: `${BUCKET_URL}/thumbnails/impressionism.webp`,
    preview: `${BUCKET_URL}/previews/impressionism.webp`,
    exampleImage: `https://picsum.photos/seed/impressionism/200/100`
  },
  {
    id: 'iron-pen-sketch',
    label: 'Iron Pen Sketch',
    label_vi: 'Phác thảo Bút sắt',
    folderId: 'fld_sketch',
    prompt: 'an intricate iron pen sketch, characterized by sharp, deliberate lines and cross-hatching for depth and shadow.',
    prompt_vi: 'một bản phác thảo bút sắt phức tạp, đặc trưng bởi các đường nét sắc sảo, có chủ ý và gạch chéo để tạo chiều sâu và bóng.',
    thumbnail: `${BUCKET_URL}/thumbnails/iron-pen-sketch.webp`,
    preview: `${BUCKET_URL}/previews/iron-pen-sketch.webp`,
    exampleImage: `https://picsum.photos/seed/iron-pen-sketch/200/100`
  },
  {
    id: 'lacquer-painting',
    label: 'Lacquer Painting',
    label_vi: 'Tranh Sơn mài',
    folderId: 'fld_vietnam',
    prompt: 'An artwork in the traditional Vietnamese lacquer painting style, featuring glossy surfaces, rich colors, and intricate mother-of-pearl inlay details.',
    prompt_vi: 'Một tác phẩm nghệ thuật theo phong cách tranh sơn mài truyền thống của Việt Nam, có bề mặt bóng, màu sắc phong phú và các chi tiết khảm xà cừ phức tạp.',
    thumbnail: `${BUCKET_URL}/thumbnails/lacquer-painting.webp`,
    preview: `${BUCKET_URL}/previews/lacquer-painting.webp`,
    exampleImage: `https://picsum.photos/seed/lacquer-painting/200/100`
  },
  {
    id: 'oil-painting',
    label: 'Oil Painting',
    label_vi: 'Tranh Sơn dầu',
    folderId: 'fld_oilpainting',
    prompt: 'an expressive oil painting with visible brushstrokes and rich textures.',
    prompt_vi: 'một bức tranh sơn dầu biểu cảm với các nét cọ có thể nhìn thấy và kết cấu phong phú.',
    thumbnail: `${BUCKET_URL}/thumbnails/oil-painting.webp`,
    preview: `${BUCKET_URL}/previews/oil-painting.webp`,
    exampleImage: `https://picsum.photos/seed/oil-painting/200/100`
  },
  {
    id: 'pixel-art',
    label: 'Pixel Art',
    label_vi: 'Nghệ thuật Pixel',
    folderId: 'fld_hoathinh',
    prompt: 'a retro pixel art style, reminiscent of 16-bit video games.',
    prompt_vi: 'một phong cách nghệ thuật pixel cổ điển, gợi nhớ đến các trò chơi điện tử 16-bit.',
    thumbnail: `${BUCKET_URL}/thumbnails/pixel-art.webp`,
    preview: `${BUCKET_URL}/previews/pixel-art.webp`,
    exampleImage: `https://picsum.photos/seed/pixel-art/200/100`
  },
  {
    id: 'sculpture',
    label: 'Sculpture',
    label_vi: 'Điêu khắc Đá',
    folderId: 'fld_dieukhac',
    prompt: 'as if it were a classical marble sculpture, with smooth textures and dramatic lighting.',
    prompt_vi: 'như thể nó là một tác phẩm điêu khắc bằng đá cẩm thạch cổ điển, với kết cấu mịn màng và ánh sáng đầy kịch tính.',
    thumbnail: `${BUCKET_URL}/thumbnails/sculpture.webp`,
    preview: `${BUCKET_URL}/previews/sculpture.webp`,
    exampleImage: `https://picsum.photos/seed/sculpture/200/100`
  },
  {
    id: 'studio-ghibli',
    label: 'Studio Ghibli Style',
    label_vi: 'Phong cách Ghibli',
    folderId: 'fld_hoathinh',
    prompt: 'In the whimsical and detailed animation style of Studio Ghibli, with a focus on nature and serene atmospheres.',
    prompt_vi: 'Theo phong cách hoạt hình hay thay đổi và chi tiết của Studio Ghibli, tập trung vào thiên nhiên và bầu không khí thanh bình.',
    thumbnail: `${BUCKET_URL}/thumbnails/studio-ghibli.webp`,
    preview: `${BUCKET_URL}/previews/studio-ghibli.webp`,
    exampleImage: `https://picsum.photos/seed/studio-ghibli/200/100`
  },
  {
    id: 'vietnamese-folk-animation',
    label: 'Vietnamese Folk Animation',
    label_vi: 'Hoạt hình Dân gian VN',
    folderId: 'fld_vietnam',
    prompt: 'An artwork in the style of traditional Vietnamese folk animation, characterized by simple, bold outlines, flat areas of color, and charming, stylized figures often depicting rural life and folklore.',
    prompt_vi: 'Một tác phẩm nghệ thuật theo phong cách hoạt hình dân gian truyền thống của Việt Nam, đặc trưng bởi các đường viền đơn giản, đậm nét, các mảng màu phẳng và các nhân vật cách điệu, duyên dáng thường mô tả cuộc sống nông thôn và văn hóa dân gian.',
    thumbnail: `${BUCKET_URL}/thumbnails/vietnamese-folk-animation.webp`,
    preview: `${BUCKET_URL}/previews/vietnamese-folk-animation.webp`,
    exampleImage: `https://picsum.photos/seed/vietnamese-folk-animation/200/100`
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    label_vi: 'Tranh Màu nước',
    folderId: 'fld_watercolor',
    prompt: 'a delicate watercolor painting with soft edges and transparent layers.',
    prompt_vi: 'một bức tranh màu nước tinh tế với các cạnh mềm mại và các lớp trong suốt.',
    thumbnail: `${BUCKET_URL}/thumbnails/watercolor.webp`,
    preview: `${BUCKET_URL}/previews/watercolor.webp`,
    exampleImage: `https://picsum.photos/seed/watercolor/200/100`
  }
];
