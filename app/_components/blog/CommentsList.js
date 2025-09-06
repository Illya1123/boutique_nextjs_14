import CommentItem from './CommentItem'

export default function CommentsList(props) {
    const { items } = props
    return (
        <ul className="space-y-6">
            {items.map((node) => (
                <CommentItem key={node.id} node={node} {...props} />
            ))}
        </ul>
    )
}
