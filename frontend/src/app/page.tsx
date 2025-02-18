import Text from "../components/text/text"

export default function Home(){
	return (
		<main className="w-full max-w-full overflow-hidden gap-5 flex items-center justify-center flex-col">
			<Text size='h1'>Cakes & Bakes</Text>
			<Text className="max-w-[75ch] text-wrap text-center text-neutral-700">
				At Cakes & Bakes, we believe in celebrating life's sweetest moments with a touch of homemade perfection. Whether it's a birthday, wedding, or a simple treat for yourself, our cakes are crafted with love, care, and the finest ingredients.
			</Text>
		</main>
	)
}