import {ReactNode, useState} from 'react';

// Components
import CenteredModal from '../layout/CenteredModal';
import CloseButton from '../layout/CloseButton';
import NYTimes from './NYTimes';
import Support from './Support';


export default function Articles() {
    return (
        <>
            <h1 className="mb-6">Articles</h1>
            <section className="flex flex-col gap-3">
                <ArticleCard name="New York Times" element={<NYTimes />}>
                    Instructions for how to register for a free New York Times subscription.
                </ArticleCard>
                <ArticleCard name="Support" element={<Support />}>
                    Resources for students in crisis.
                </ArticleCard>
            </section>
        </>
    );
}

type ArticleCardProps = {name: string, element: JSX.Element, children: ReactNode};
function ArticleCard(props: ArticleCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center gap-4 rounded-lg shadow-md px-5 py-4 cursor-pointer bg-gray-100 dark:bg-background-dark hover:bg-gray-50/50 dark:hover:bg-content-secondary-dark transition duration-200" onClick={() => setIsOpen(true)}>
            <h3>{props.name}</h3>
            <p className="font-light">
                {props.children}
            </p>

            <CenteredModal className="relative p-6 md:p-8 mx-2 bg-content dark:bg-content-dark rounded-lg shadow-xl max-h-[90%] overflow-y-auto scrollbar-none" isOpen={isOpen} setIsOpen={setIsOpen}>
                <CloseButton className="absolute top-4 right-4 md:right-6" onClick={() => setIsOpen(false)} />
                {props.element}
            </CenteredModal>
        </div>
    )
}
