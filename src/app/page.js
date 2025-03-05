export default function Home() {
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Sample UI</h1>

      {/* Input with label */}
      <div>
        <label htmlFor="email" className="form-label">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="input-field"
          required
        />
      </div>

      {/* Input with error */}
      <div>
        <label htmlFor="password" className="form-label">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          className="input-field input-error"
          required
        />
        <p className="error-text">Password is required</p>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pt-4">
        <button className="btn-primary">Sign In</button>
        <button className="btn-secondary">Create Account</button>
        <button className="btn-tertiary">Continue with Google</button>
      </div>
    </div>
  );
}
