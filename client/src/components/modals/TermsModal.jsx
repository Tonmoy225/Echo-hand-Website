export default function TermsModal({ onClose }) {
  return (
    <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <div className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="modal-title">
          <i className="fa-solid fa-file-contract" style={{ color: "var(--accent)" }}></i> Terms
          of Policy
        </div>
        <div className="terms-content">
          <h3>1. Platform Purpose</h3>
          <p>
            EcoHand is a peer-to-peer marketplace for second-hand electronics. Our mission is to
            reduce e-waste and give devices a second life. By using EcoHand you agree to
            participate responsibly in this mission.
          </p>
          <h3>2. User Responsibilities</h3>
          <p>
            Sellers must accurately describe items, including condition, age, and defects.
            Misleading listings will result in account suspension. Buyers are encouraged to ask
            questions before purchase.
          </p>
          <h3>3. Prohibited Items</h3>
          <p>
            Counterfeit goods, stolen electronics, and damaged-beyond-repair items are strictly
            prohibited. EcoHand reserves the right to remove any listing without notice.
          </p>
          <h3>4. Transactions</h3>
          <p>
            All transactions are between buyers and sellers. EcoHand facilitates connections but
            does not handle payment processing. Users transact at their own risk. We recommend
            meeting in public places for cash transactions.
          </p>
          <h3>5. Privacy Policy</h3>
          <p>
            We collect minimal data required to operate the platform. We never sell your personal
            data. Your contact details are only shared with the counterparty of an agreed
            transaction.
          </p>
          <h3>6. Eco Commitment</h3>
          <p>
            By buying or selling on EcoHand, you agree to prioritize repair and reuse over
            disposal. Please report items that should be recycled, not resold.
          </p>
          <h3>7. Dispute Resolution</h3>
          <p>
            In case of disputes, contact support within 7 days of a transaction. We will review
            evidence from both parties and make a fair determination.
          </p>
        </div>
        <button className="btn btn-accent" style={{ marginTop: 16 }} onClick={onClose}>
          I Understand
        </button>
      </div>
    </div>
  );
}
